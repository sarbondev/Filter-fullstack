import { baseApi } from './baseApi';
import type { ApiResponse, TranslatedField } from '@/shared/types';

export interface Industry {
  id: string;
  name: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export const industryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIndustries: builder.query<Industry[], void>({
      query: () => '/industries',
      transformResponse: (res: ApiResponse<Industry[]>) => res.data,
    }),
  }),
});

export const { useGetIndustriesQuery } = industryApi;
