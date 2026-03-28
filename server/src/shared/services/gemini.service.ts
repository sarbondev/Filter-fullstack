import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { env } from "../../config/env";
import { TranslatedField } from "../types/common.types";
import { logger } from "../utils/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Tarjima qilinadigan object.
 * Har bir field: string yoki string[] bo'lishi mumkin.
 *
 * @example
 * { name: "Telefon", description: "Zo'r telefon", tags: ["mobil", "elektronika"] }
 */
export type TranslatableInput = Record<string, string | string[]>;

/**
 * Natija — har bir kiritilgan field uchun { uz, ru, en } qaytariladi.
 *
 * @example
 * {
 *   name:        { uz: "Telefon", ru: "Телефон", en: "Phone" },
 *   description: { uz: "...",     ru: "...",     en: "..."   },
 *   tags:        { uz: "...",     ru: "...",     en: "..."   },
 * }
 */
export type TranslatedOutput<T extends TranslatableInput> = {
  [K in keyof T]: TranslatedField;
};

export interface TranslateOptions {
  sourceLanguage?: "uz" | "ru" | "en";
  context?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class GeminiService {
  private readonly model: GenerativeModel;

  constructor() {
    const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = client.getGenerativeModel({
      model: env.GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
  }

  /**
   * Universal translator — istalgan object strukturasini UZ, RU, EN ga tarjima qiladi.
   * Bitta Gemini API chaqiruvi bilan barcha fieldlarni tarjima qiladi (samarali).
   *
   * @example — Product:
   * const result = await geminiService.translate({
   *   name: "Smartfon Samsung Galaxy",
   *   description: "128GB xotira, 50MP kamera",
   * }, { sourceLanguage: 'uz', context: 'e-commerce product' });
   *
   * result.name.ru   // → "Смартфон Samsung Galaxy"
   * result.name.en   // → "Samsung Galaxy Smartphone"
   *
   * @example — Category:
   * const result = await geminiService.translate(
   *   { name: "Elektronika", slug_label: "Ko'chma qurilmalar" },
   *   { context: 'product category' }
   * );
   *
   * @example — Blog post:
   * const result = await geminiService.translate(
   *   { title: "Yangi mahsulotlar", summary: "Bu oy eng ko'p sotilganlar" },
   *   { context: 'blog post' }
   * );
   */
  async translate<T extends TranslatableInput>(
    fields: T,
    options: TranslateOptions = {},
  ): Promise<TranslatedOutput<T>> {
    const { context = "e-commerce content" } = options;

    const fieldsJson = JSON.stringify(fields, null, 2);

    const expectedStructure = Object.keys(fields).reduce(
      (acc, key) => ({ ...acc, [key]: { uz: "...", ru: "...", en: "..." } }),
      {} as Record<string, unknown>,
    );

    const prompt = `You are a professional multilingual translator and editor for a filter-system factory e-commerce platform.
Context: ${context}

Your task: Auto-detect the input language, FIX any spelling/grammar mistakes in the original text, then provide corrected and properly translated versions in all three languages:
- Uzbek (uz) — MUST use Latin script, never Cyrillic
- Russian (ru) — use Cyrillic script
- English (en)

Input fields:
${fieldsJson}

Rules:
1. Auto-detect the source language from the input text
2. ALWAYS fix and improve the input: correct spelling mistakes, grammar errors, incomplete words, and awkward phrasing — return a clean, proper version for ALL three languages including the source language
3. Keep brand names, model numbers, technical specs, measurements, and proper nouns unchanged across all languages
4. Use natural, fluent, professional language appropriate for ${context}
5. If input is an array, join items with a comma into one translated string per language
6. Do NOT add extra fields, do NOT omit any field
7. Respond ONLY with valid JSON, no markdown, no explanation

Required JSON structure:
${JSON.stringify(expectedStructure, null, 2)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      logger.debug({ responseText }, "Gemini raw response");
      const parsed = JSON.parse(responseText) as TranslatedOutput<T>;
      logger.info(
        { fields: Object.keys(fields), context },
        "Gemini: translation successful",
      );
      return parsed;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      logger.error(
        { error: errMsg, fields: Object.keys(fields), context },
        "Gemini translation failed — using fallback",
      );
      return Object.entries(fields).reduce((acc, [key, value]) => {
        const raw = Array.isArray(value) ? value.join(", ") : value;
        return { ...acc, [key]: { uz: raw, ru: raw, en: raw } };
      }, {} as TranslatedOutput<T>);
    }
  }

  /**
   * Bitta string matnni tarjima qiladi.
   */
  async translateOne(
    text: string,
    options: TranslateOptions = {},
  ): Promise<TranslatedField> {
    const result = await this.translate({ value: text }, options);
    return result.value;
  }

  /**
   * Translates a name and auto-generates a description in all 3 languages.
   * Used for categories where description is AI-generated from the name.
   */
  async translateWithDescription(
    name: string,
    context = "filter-system factory product category",
  ): Promise<{ name: TranslatedField; description: TranslatedField }> {
    const prompt = `You are a professional multilingual content writer for a filter-system factory e-commerce platform.
Context: ${context}

Given this category name (auto-detect language, fix any spelling/grammar):
"${name}"

Tasks:
1. Fix and correct the name, then translate it into all 3 languages
2. Generate a short professional 1-2 sentence description for this category, in all 3 languages

Languages:
- Uzbek (uz) — Latin script only
- Russian (ru) — Cyrillic script
- English (en)

Respond ONLY with valid JSON:
{
  "name": { "uz": "...", "ru": "...", "en": "..." },
  "description": { "uz": "...", "ru": "...", "en": "..." }
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      logger.debug({ responseText }, "Gemini category response");
      const parsed = JSON.parse(responseText) as { name: TranslatedField; description: TranslatedField };
      logger.info({ name, context }, "Gemini: category translation successful");
      return parsed;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      logger.error({ error: errMsg, name, context }, "Gemini category translation failed — using fallback");
      return {
        name: { uz: name, ru: name, en: name },
        description: { uz: name, ru: name, en: name },
      };
    }
  }
}

export const geminiService = new GeminiService();

// legacy type aliases — product.service.ts bilan backward compat
/** @deprecated — `geminiService.translate(...)` dan foydalaning */
export type ProductTranslationInput = {
  name: string;
  description: string;
  sourceLanguage?: "uz" | "ru" | "en";
};
/** @deprecated */
export type ProductTranslations = {
  name: TranslatedField;
  description: TranslatedField;
};
