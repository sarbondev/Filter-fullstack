import { baseApi } from './baseApi';
import type { ApiResponse, AuthResponse, LoginRequest } from '@/lib/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (res: ApiResponse<AuthResponse>) => res.data,
    }),
    updateProfile: builder.mutation<ApiResponse<{ id: string; phoneNumber: string; name: string; role: string }>, { name?: string; phoneNumber?: string }>({
      query: (body) => ({ url: '/auth/profile', method: 'PATCH', body }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation, useUpdateProfileMutation, useChangePasswordMutation } = authApi;
