import type { TranslatedField, Locale } from '@/shared/types';

export function t(field: TranslatedField | undefined, locale: Locale): string {
  if (!field) return '';
  return field[locale] || field.en || '';
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getDiscountPercent(price: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path; // rewrites handle /uploads/* -> server
}
