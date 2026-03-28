import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResult,
  Product,
  CreateProductRequest,
} from "@/lib/types";

interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  isFeatured?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResult<Product>,
      ProductsQuery | void
    >({
      query: (params) => ({ url: "/products/admin/all", params: params || {} }),
      transformResponse: (res: PaginatedApiResponse<Product>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              "Product",
            ]
          : ["Product"],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: ApiResponse<Product>) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      transformResponse: (res: ApiResponse<Product>) => res.data,
      invalidatesTags: ["Product", "Dashboard"],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; data: Partial<CreateProductRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (res: ApiResponse<Product>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }, "Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product", "Dashboard"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
