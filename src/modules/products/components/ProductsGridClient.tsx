'use client';

import { startTransition, useDeferredValue } from 'react';

import { ProductCard } from '@/modules/products/components/ProductCard';
import { useProducts } from '@/modules/products/hooks/use-products';
import { useProductFiltersStore } from '@/modules/products/store/use-product-filters-store';
import type { Product } from '@/modules/products/types';
import { Input } from '@/shared/components/ui/Input';

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
      <div className="surface grid gap-4 p-5 md:grid-cols-[1fr_180px]">
        <Input
          label="Search inventory"
          placeholder="Search by product, vendor, or category"
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            startTransition(() => setSearch(value));
          }}
        />
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Sort by</span>
          <select
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
          >
            <option value="featured">Featured</option>
            <option value="trust">Trust score</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {isFetching ? <p className="text-sm text-slate-500">Refreshing catalog...</p> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
