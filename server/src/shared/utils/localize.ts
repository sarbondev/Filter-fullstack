import { Request } from 'express';
import type { TranslatedField, Locale } from '../types/common.types';

/**
 * Extract the localized string from a TranslatedField based on request locale.
 */
export function localize(field: TranslatedField, locale: Locale): string {
  return field[locale] || field.en;
}

/**
 * Recursively localize all TranslatedField objects in a response.
 * If `fullTranslation` query param is 'true', returns all languages.
 * Otherwise returns only the requested locale as a plain string.
 */
export function localizeResponse<T>(data: T, req: Request): T {
  const full = req.query['fullTranslation'] === 'true';
  if (full) return data;
  return deepLocalize(data, req.locale);
}

function deepLocalize<T>(data: T, locale: Locale): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map((item) => deepLocalize(item, locale)) as T;
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    // Check if it's a TranslatedField
    if ('uz' in obj && 'ru' in obj && 'en' in obj && Object.keys(obj).length === 3 &&
        typeof obj.uz === 'string' && typeof obj.ru === 'string' && typeof obj.en === 'string') {
      return (obj[locale] || obj.en) as T;
    }
    // Recurse into object
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepLocalize(value, locale);
    }
    return result as T;
  }
  return data;
}
