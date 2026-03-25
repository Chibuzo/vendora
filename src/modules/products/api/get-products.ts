import { apiClient } from '@/lib/api-client';
import { buildQueryString } from '@/lib/utils';

import type { ProductCatalogResponse, ProductFilters } from '@/modules/products/types';

export async function getProducts(filters: Partial<ProductFilters> = {}) {
  const query = buildQueryString({
    search: filters.search,
    category: filters.category,
    sortBy: filters.sortBy,
    limit: filters.limit
  });
  const response = await apiClient.get<ProductCatalogResponse>(`/products${query}`);
  return response.data;
}
