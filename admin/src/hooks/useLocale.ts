import { useTranslation } from 'react-i18next';
import type { TranslatedField } from '@/lib/types';

type Locale = keyof TranslatedField;

export function useLocale(): Locale {
  const { i18n } = useTranslation();
  const lang = i18n.language as Locale;
  return ['uz', 'ru', 'en', 'kz'].includes(lang) ? lang : 'ru';
}

export function tf(field: TranslatedField | undefined | null, locale: Locale): string {
  if (!field) return '';
  return field[locale] || field.ru || field.en || '';
}
