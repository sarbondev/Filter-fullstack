import { baseApi } from './baseApi';
import type { ApiResponse, Review } from '@/lib/types';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], void>({
      query: () => '/reviews',
      transformResponse: (res: ApiResponse<Review[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Review' as const, id })), 'Review']
          : ['Review'],
    }),
    approveReview: builder.mutation<Review, string>({
      query: (id) => ({ url: `/reviews/${id}/approve`, method: 'PATCH' }),
      transformResponse: (res: ApiResponse<Review>) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: 'Review', id }, 'Review'],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const { useGetReviewsQuery, useApproveReviewMutation, useDeleteReviewMutation } = reviewApi;
