import { baseApi } from './baseApi';
import type { ApiResponse, Review } from '@/shared/types';

interface ReviewsResponse {
  reviews: Review[];
  average: number;
  count: number;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ReviewsResponse, string>({
      query: (productId) => `/reviews/product/${productId}`,
      transformResponse: (res: ApiResponse<ReviewsResponse>) => res.data,
      providesTags: ['Review'],
    }),
  }),
});

export const { useGetProductReviewsQuery } = reviewApi;
