import { baseApi } from './baseApi';
import type { ApiResponse, DashboardStats } from '@/lib/types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      transformResponse: (res: ApiResponse<DashboardStats>) => res.data,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
