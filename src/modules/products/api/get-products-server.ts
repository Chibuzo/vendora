import { env } from '@/config/env';
import { serverApiClient } from '@/lib/server-api';
import { mockProducts } from '@/shared/constants/mock-data';

import { normalizeProductFilters, sortAndFilterProducts } from '@/modules/products/services/product-service';
import type { ProductCatalogResponse, ProductFilters } from '@/modules/products/types';

export async function getProductsServer(filters: Partial<ProductFilters> = {}) {
  const normalized = normalizeProductFilters(filters);

  if (env.NEXT_PUBLIC_ENABLE_MOCKS) {
    const items = sortAndFilterProducts(mockProducts, normalized).slice(0, normalized.limit);

    return {
      items,
      total: items.length,
      page: 1,
      pageSize: normalized.limit
    } satisfies ProductCatalogResponse;
  }

  const query = new URLSearchParams({
    sortBy: normalized.sortBy,
    limit: String(normalized.limit)
  });

  if (normalized.search) {
    query.set('search', normalized.search);
  }

  if (normalized.category) {
    query.set('category', normalized.category);
  }

  const response = await serverApiClient.get<ProductCatalogResponse>(`/products?${query.toString()}`);
  return response.data;
}
