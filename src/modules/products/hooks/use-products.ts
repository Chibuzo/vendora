'use client';

import { useQuery } from '@tanstack/react-query';

import { getProducts } from '@/modules/products/api/get-products';
import type { Product, ProductCatalogResponse, ProductFilters } from '@/modules/products/types';

export function useProducts(filters: Partial<ProductFilters>, initialProducts?: Product[]) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    initialData: initialProducts
      ? ({
          items: initialProducts,
          total: initialProducts.length,
          page: 1,
          pageSize: initialProducts.length
        } satisfies ProductCatalogResponse)
      : undefined
  });
}
