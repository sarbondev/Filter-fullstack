import { baseApi } from './baseApi';
import type { ApiResponse, PaginatedApiResponse, PaginatedResult, Blog, CreateBlogRequest } from '@/lib/types';

interface BlogsQuery {
  page?: number;
  limit?: number;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<PaginatedResult<Blog>, BlogsQuery | void>({
      query: (params) => ({ url: '/blogs/admin/all', params: params || {} }),
      transformResponse: (res: PaginatedApiResponse<Blog>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Blog' as const, id })), 'Blog']
          : ['Blog'],
    }),
    getBlog: builder.query<Blog, string>({
      query: (id) => `/blogs/${id}`,
      transformResponse: (res: ApiResponse<Blog>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Blog', id }],
    }),
    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      query: (body) => ({ url: '/blogs', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Blog>) => res.data,
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<Blog, { id: string; data: Partial<CreateBlogRequest> }>({
      query: ({ id, data }) => ({ url: `/blogs/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Blog>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({ url: `/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
