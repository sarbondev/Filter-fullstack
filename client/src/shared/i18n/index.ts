import type { Locale } from "@/shared/types";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
  uz: () => import("./dictionaries/uz").then((m) => m.default),
  kz: () => import("./dictionaries/kz").then((m) => m.default),
};

export const locales: Locale[] = ["uz", "ru", "en", "kz"];
export const defaultLocale: Locale = "ru";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
