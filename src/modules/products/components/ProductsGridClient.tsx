'use client';

import { startTransition, useDeferredValue } from 'react';

import { ProductCard } from '@/modules/products/components/ProductCard';
import { useProducts } from '@/modules/products/hooks/use-products';
import { useProductFiltersStore } from '@/modules/products/store/use-product-filters-store';
import type { Product } from '@/modules/products/types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';

export function ProductsGridClient({
  initialProducts
}: Readonly<{
  initialProducts: Product[];
}>) {
  const { search, sortBy, setSearch, setSortBy } = useProductFiltersStore();
  const deferredSearch = useDeferredValue(search);
  const { data, isFetching } = useProducts(
    {
      search: deferredSearch,
      sortBy
    },
    initialProducts
  );
  const items = data?.items ?? initialProducts;

  return (
    <div className="space-y-6">
      <Card className="bg-surface/90">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_220px]">
          <Input
            label="Search inventory"
            placeholder="Search by product, vendor, or category"
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              startTransition(() => setSearch(value));
            }}
          />
          <Select
            label="Sort by"
            value={sortBy}
            onValueChange={(value) => setSortBy(value as typeof sortBy)}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'trust', label: 'Trust score' },
              { value: 'price-asc', label: 'Price: low to high' },
              { value: 'price-desc', label: 'Price: high to low' }
            ]}
          />
        </CardContent>
      </Card>

      {isFetching ? <p className="text-sm text-muted-foreground">Refreshing catalog...</p> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
