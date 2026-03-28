import { Request } from 'express';
import { PaginationQuery, PaginatedResponse } from '../types/common.types';

export const parsePagination = (req: Request): PaginationQuery => {
  const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  { page, limit }: PaginationQuery,
): PaginatedResponse<T> => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  },
});
