import { baseApi } from './baseApi';
import type { ApiResponse, Category } from '@/shared/types';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories?active=true',
      transformResponse: (res: ApiResponse<Category[]>) => res.data ?? [],
      providesTags: ['Category'],
    }),
    getCategoryTree: builder.query<Category[], void>({
      query: () => '/categories/tree',
      transformResponse: (res: ApiResponse<Category[]>) => res.data ?? [],
      providesTags: ['Category'],
    }),
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/slug/${slug}`,
      transformResponse: (res: ApiResponse<Category>) => res.data,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryTreeQuery, useGetCategoryBySlugQuery } = categoryApi;
