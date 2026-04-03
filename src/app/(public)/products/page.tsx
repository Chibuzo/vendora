'use client';

import { useState } from 'react';

import { useMarketplaceProducts } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { routes } from '@/shared/constants/routes';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const { data, isLoading } = useMarketplaceProducts({
    q: query || undefined,
    category: category || undefined,
    sort: sort || undefined
  });

  if (isLoading || !data) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Product listing"
        title="Searchable public catalog"
        description="Browse products by keyword, category, price direction, and trust-aware vendor context."
      />
      <div className="grid gap-4 rounded-[var(--radius-2xl)] border border-border/70 bg-surface p-5 md:grid-cols-3">
        <Input label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or vendors" />
        <Select
          label="Category"
          value={category}
          onValueChange={setCategory}
          options={[
            { label: 'All categories', value: '' },
            ...data.filters.categories.map((entry) => ({ label: entry, value: entry }))
          ]}
        />
        <Select
          label="Sort"
          value={sort}
          onValueChange={setSort}
          options={[
            { label: 'Featured', value: '' },
            { label: 'Price: low to high', value: 'price-asc' },
            { label: 'Price: high to low', value: 'price-desc' },
            { label: 'Vendor rating', value: 'rating' }
          ]}
        />
      </div>
      {data.items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.items.map((product) => (
            <ProductCard
              key={product.id}
              image={product.imageUrl}
              name={product.name}
              price={product.price}
              currency={product.currency}
              vendor={product.vendorName}
              rating={product.rating}
              reviewCount={product.reviewCount}
              trustStatus={product.trustScore >= 92 ? 'verified' : 'high-trust'}
              description={product.description}
              category={product.category}
              href={routes.public.productDetail(product.slug)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products match those filters"
          description="Adjust the search term, category, or sorting to find inventory."
        />
      )}
    </div>
  );
}
