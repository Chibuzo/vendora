import { z } from 'zod';

import type { Product, ProductFilters } from '@/modules/products/types';

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'trust']).default('featured'),
  limit: z.coerce.number().int().min(1).max(24).default(6)
});

export function normalizeProductFilters(
  input: URLSearchParams | Partial<ProductFilters>
): ProductFilters {
  const source =
    input instanceof URLSearchParams
      ? {
          search: input.get('search') ?? undefined,
          category: input.get('category') ?? undefined,
          sortBy: input.get('sortBy') ?? undefined,
          limit: input.get('limit') ?? undefined
        }
      : input;

  return productFilterSchema.parse(source);
}

export function sortAndFilterProducts(products: Product[], filters: ProductFilters) {
  const search = filters.search?.toLowerCase();

  const filtered = products.filter((product) => {
    const matchesSearch =
      !search ||
      [product.name, product.vendorName, product.category, product.description]
        .join(' ')
        .toLowerCase()
        .includes(search);

    const matchesCategory = !filters.category || product.category === filters.category;
    return matchesSearch && matchesCategory;
  });

  return filtered.sort((left, right) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return left.price - right.price;
      case 'price-desc':
        return right.price - left.price;
      case 'trust':
        return right.trustScore - left.trustScore;
      default:
        return Number(right.featured) - Number(left.featured);
    }
  });
}
