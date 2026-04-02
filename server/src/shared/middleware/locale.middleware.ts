import { Request, Response, NextFunction } from 'express';
import type { Locale } from '../types/common.types';

declare global {
  namespace Express {
    interface Request {
      locale: Locale;
    }
  }
}

const SUPPORTED_LOCALES: Locale[] = ['uz', 'ru', 'en', 'kz'];
const DEFAULT_LOCALE: Locale = 'en';

function parseLocale(value: string | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const clean = value.split(',')[0]?.split('-')[0]?.trim().toLowerCase();
  if (clean && SUPPORTED_LOCALES.includes(clean as Locale)) return clean as Locale;
  return DEFAULT_LOCALE;
}

export const localeMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const queryLang = req.query['lang'] as string | undefined;
  const headerLang = req.headers['accept-language'];
  req.locale = parseLocale(queryLang || headerLang);
  next();
};
