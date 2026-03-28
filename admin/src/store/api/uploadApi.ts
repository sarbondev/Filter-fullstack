import { baseApi } from './baseApi';

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

interface ApiUploadResponse {
  success: boolean;
  message: string;
  data: UploadResponse | UploadResponse[];
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingle: builder.mutation<UploadResponse, FormData>({
      query: (body) => ({
        url: '/upload/single',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiUploadResponse) => res.data as UploadResponse,
    }),
    uploadMultiple: builder.mutation<UploadResponse[], FormData>({
      query: (body) => ({
        url: '/upload/multiple',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiUploadResponse) => res.data as UploadResponse[],
    }),
    deleteFile: builder.mutation<void, string>({
      query: (url) => ({
        url: '/upload',
        method: 'DELETE',
        body: { url },
      }),
    }),
  }),
});

export const { useUploadSingleMutation, useUploadMultipleMutation, useDeleteFileMutation } = uploadApi;
