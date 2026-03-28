import { baseApi } from './baseApi';
import type { ApiResponse, User, CreateUserRequest } from '@/lib/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (res: ApiResponse<User[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), 'User']
          : ['User'],
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      transformResponse: (res: ApiResponse<User>) => res.data,
      invalidatesTags: ['User', 'Dashboard'],
    }),
    updateUser: builder.mutation<User, { id: string; data: { name?: string; phoneNumber?: string } }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<User>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User', 'Dashboard'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
