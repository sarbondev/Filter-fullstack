import { baseApi } from './baseApi';
import type { ApiResponse, Banner } from '@/shared/types';

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<Banner[], void>({
      query: () => '/banners',
      transformResponse: (res: ApiResponse<Banner[]>) => res.data,
      providesTags: ['Banner'],
    }),
  }),
});

export const { useGetBannersQuery } = bannerApi;
