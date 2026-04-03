'use client';

import { useState } from 'react';

import { useMarketplaceSearch } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { VendorCard } from '@/shared/components/marketplace/vendor-card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { routes } from '@/shared/constants/routes';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { data } = useMarketplaceSearch({
    q: query || undefined,
    category: category || undefined,
    verifiedOnly
  });

  const categories = ['Energy', 'Packaging', 'Operations', 'Logistics', 'Analytics'];

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Search results"
        title="Search vendors and products from one public surface."
        description="Discovery stays lightweight while still exposing the filters buyers care about most."
      />
      <div className="grid gap-4 rounded-[var(--radius-2xl)] border border-border/70 bg-surface p-5 md:grid-cols-[1fr_220px_auto]">
        <Input label="Query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the marketplace" />
        <Select
          label="Category"
          value={category}
          onValueChange={setCategory}
          options={[{ label: 'All categories', value: '' }, ...categories.map((entry) => ({ label: entry, value: entry }))]}
        />
        <div className="flex items-end pb-1">
          <Checkbox
            checked={verifiedOnly}
            onCheckedChange={(checked) => setVerifiedOnly(Boolean(checked))}
            label="Verified only"
          />
        </div>
      </div>

      {!data || (!data.products.length && !data.vendors.length) ? (
        <EmptyState
          title="No results yet"
          description="Search by product, vendor, or category to populate this page."
        />
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Vendors</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {data.vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  businessName={vendor.businessName}
                  trustScore={vendor.trustScore}
                  rating={vendor.rating}
                  reviewCount={Math.max(12, Math.round(vendor.totalOrders / 3))}
                  location={vendor.location}
                  verificationStatus={vendor.verificationStatus === 'VERIFIED' ? 'verified' : 'high-trust'}
                  tagline={vendor.description}
                  href={routes.public.vendorDetail(vendor.slug)}
                />
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Products</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {data.products.map((product) => (
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
          </section>
        </div>
      )}
    </div>
  );
}
