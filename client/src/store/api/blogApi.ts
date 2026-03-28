import { baseApi } from './baseApi';
import type { ApiResponse, PaginatedApiResponse } from '@/shared/types';
import type { Blog } from '@/shared/types';

interface BlogsQuery {
  page?: number;
  limit?: number;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<PaginatedApiResponse<Blog>, BlogsQuery | void>({
      query: (params) => ({ url: '/blogs', params: params || {} }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blogs/slug/${slug}`,
      transformResponse: (res: ApiResponse<Blog>) => res.data,
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogBySlugQuery } = blogApi;
