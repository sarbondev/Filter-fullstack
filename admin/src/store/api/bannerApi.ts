import { baseApi } from './baseApi';
import type { ApiResponse, Banner, CreateBannerRequest } from '@/lib/types';

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<Banner[], void>({
      query: () => '/banners/all',
      transformResponse: (res: ApiResponse<Banner[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Banner' as const, id })), 'Banner']
          : ['Banner'],
    }),
    createBanner: builder.mutation<Banner, CreateBannerRequest>({
      query: (body) => ({ url: '/banners', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Banner>) => res.data,
      invalidatesTags: ['Banner'],
    }),
    updateBanner: builder.mutation<Banner, { id: string; data: Partial<CreateBannerRequest> }>({
      query: ({ id, data }) => ({ url: `/banners/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Banner>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Banner', id }, 'Banner'],
    }),
    deleteBanner: builder.mutation<void, string>({
      query: (id) => ({ url: `/banners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
