import { baseApi } from './baseApi';

interface LoginRequest {
  phoneNumber: string;
  password: string;
}

interface RegisterRequest {
  phoneNumber: string;
  password: string;
  name: string;
}

interface AuthUser {
  id: string;
  phoneNumber: string;
  name: string;
  role: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  expiresIn: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (res: ApiResponse<AuthResponse>) => res.data,
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (res: ApiResponse<AuthResponse>) => res.data,
    }),
    updateProfile: builder.mutation<ApiResponse<AuthUser>, { name?: string; phoneNumber?: string }>({
      query: (body) => ({ url: '/auth/profile', method: 'PATCH', body }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUpdateProfileMutation, useChangePasswordMutation } = authApi;
