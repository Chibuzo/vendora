'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions
} from '@tanstack/react-query';

import { ApiClientError } from '../client';
import {
  createProduct,
  deleteProduct,
  getCurrentVendorProducts,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct
} from '../endpoints/products';
import type {
  CreateProductInput,
  CurrentVendorProductsParams,
  Empty,
  Product,
  ProductListData,
  ProductsListParams,
  UpdateProductInput
} from '../types';

type QueryOptions<TResult, TKey extends QueryKey> = Omit<
  UseQueryOptions<TResult, ApiClientError, TResult, TKey>,
  'queryFn' | 'queryKey'
>;

type MutationOptions<TResult, TVariables, TOnMutateResult = unknown> = Omit<
  UseMutationOptions<TResult, ApiClientError, TVariables, TOnMutateResult>,
  'mutationFn' | 'mutationKey'
>;

export const productKeys = {
  root: ['products'] as const,
  lists: (params?: ProductsListParams) => ['products', params ?? null] as const,
  currentVendor: (params?: CurrentVendorProductsParams) =>
    ['products', 'current-vendor', params ?? null] as const,
  detail: (id: string) => ['product', id] as const,
  slug: (slug: string) => ['product', 'slug', slug] as const
};

export function useProducts(
  params?: ProductsListParams,
  options?: QueryOptions<ProductListData, ReturnType<typeof productKeys.lists>>
) {
  return useQuery({
    queryKey: productKeys.lists(params),
    queryFn: () => getProducts(params),
    staleTime: 60_000,
    ...options
  });
}

export function useProduct(
  id: string,
  options?: QueryOptions<Product, ReturnType<typeof productKeys.detail>>
) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 60_000,
    ...options
  });
}

export function useProductBySlug(
  slug: string,
  options?: QueryOptions<Product, ReturnType<typeof productKeys.slug>>
) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 60_000,
    ...options
  });
}

export function useCurrentVendorProducts(
  params?: CurrentVendorProductsParams,
  options?: QueryOptions<ProductListData, ReturnType<typeof productKeys.currentVendor>>
) {
  return useQuery({
    queryKey: productKeys.currentVendor(params),
    queryFn: () => getCurrentVendorProducts(params),
    ...options
  });
}

export function useCreateProduct(options?: MutationOptions<Product, CreateProductInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Product, ApiClientError, CreateProductInput>({
    mutationKey: [...productKeys.root, 'create'],
    mutationFn: createProduct,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(productKeys.detail(data.id), data);
      queryClient.setQueryData(productKeys.slug(data.slug), data);
      void queryClient.invalidateQueries({
        queryKey: productKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useUpdateProduct(
  options?: MutationOptions<Product, { id: string; data: UpdateProductInput }>
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Product, ApiClientError, { id: string; data: UpdateProductInput }>({
    mutationKey: [...productKeys.root, 'update'],
    mutationFn: ({ id, data }) => updateProduct(id, data),
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(productKeys.detail(data.id), data);
      queryClient.setQueryData(productKeys.slug(data.slug), data);
      void queryClient.invalidateQueries({
        queryKey: productKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useDeleteProduct(options?: MutationOptions<Empty, string>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Empty, ApiClientError, string>({
    mutationKey: [...productKeys.root, 'delete'],
    mutationFn: deleteProduct,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.removeQueries({
        queryKey: productKeys.detail(variables)
      });
      void queryClient.invalidateQueries({
        queryKey: productKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}
