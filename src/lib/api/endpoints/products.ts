import type {
  Empty,
  EmptyResponse,
  Product,
  ProductResponse
} from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type {
  AddProductImagesInput,
  CreateProductInput,
  CurrentVendorProductsParams,
  ProductListData,
  ProductsListParams,
  UpdateProductInput,
  UpsertProductVariantsInput
} from '../types';

export function getProducts(params?: ProductsListParams) {
  return apiClient.get<import('@/shared/api/generated/model').ProductListResponse, ProductListData>(
    '/products',
    {
      params
    }
  );
}

export function getProductById(id: string) {
  return apiClient.get<ProductResponse, Product>(`/products/${id}`);
}

export function getProductBySlug(slug: string) {
  return apiClient.get<ProductResponse, Product>(`/products/slug/${slug}`);
}

export function createProduct(data: CreateProductInput) {
  return apiClient.post<ProductResponse, CreateProductInput, Product>('/products', data);
}

export function updateProduct(id: string, data: UpdateProductInput) {
  return apiClient.patch<ProductResponse, UpdateProductInput, Product>(`/products/${id}`, data);
}

export function deleteProduct(id: string) {
  return apiClient.delete<EmptyResponse, Empty>(`/products/${id}`);
}

export function upsertProductVariants(id: string, data: UpsertProductVariantsInput) {
  return apiClient.post<ProductResponse, UpsertProductVariantsInput, Product>(
    `/products/${id}/variants`,
    data
  );
}

export function addProductImages(id: string, data: AddProductImagesInput) {
  return apiClient.post<ProductResponse, AddProductImagesInput, Product>(
    `/products/${id}/images`,
    data
  );
}

export function removeProductImage(id: string, imageId: string) {
  return apiClient.delete<ProductResponse, Product>(`/products/${id}/images/${imageId}`);
}

export function getCurrentVendorProducts(params?: CurrentVendorProductsParams) {
  return apiClient.get<import('@/shared/api/generated/model').ProductListResponse, ProductListData>(
    '/vendors/me/products',
    {
      params
    }
  );
}
