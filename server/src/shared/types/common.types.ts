import { Request } from "express";

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: Record<string, unknown>;
}

export interface JwtPayload {
  sub: string;
  phoneNumber: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export type Locale = "uz" | "ru" | "en" | "kz";

export interface TranslatedField {
  uz: string;
  ru: string;
  en: string;
  kz: string;
}
