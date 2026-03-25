import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { toApiEnvelope } from '@/lib/api-client';
import { proxyToBackend } from '@/lib/server-api';
import { normalizeProductFilters, sortAndFilterProducts } from '@/modules/products/services/product-service';
import type { ProductCatalogResponse } from '@/modules/products/types';
import { mockProducts } from '@/shared/constants/mock-data';

export async function GET(request: NextRequest) {
  if (env.NEXT_PUBLIC_ENABLE_MOCKS) {
    const filters = normalizeProductFilters(request.nextUrl.searchParams);
    const allItems = sortAndFilterProducts(mockProducts, filters);
    const items = allItems.slice(0, filters.limit);

    return NextResponse.json(
      toApiEnvelope<ProductCatalogResponse>({
        items,
        total: allItems.length,
        page: 1,
        pageSize: filters.limit
      })
    );
  }

  return proxyToBackend<ProductCatalogResponse>(request, `/products${request.nextUrl.search}`);
}
