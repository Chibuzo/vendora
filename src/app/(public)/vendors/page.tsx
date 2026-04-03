'use client';

import { useState } from 'react';

import { useMarketplaceVendors } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { VendorCard } from '@/shared/components/marketplace/vendor-card';
import { Select } from '@/shared/components/ui/select';
import { routes } from '@/shared/constants/routes';

export default function VendorsPage() {
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const { data, isLoading } = useMarketplaceVendors({
    state: state || undefined,
    category: category || undefined
  });

  if (isLoading || !data) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Vendor listing"
        title="Compare storefronts by trust score, specialty, and region."
        description="Vendor cards stay focused on the signals buyers use first: verification, rating, location, and order history."
      />
      <div className="grid gap-4 rounded-[var(--radius-2xl)] border border-border/70 bg-surface p-5 md:grid-cols-2">
        <Select
          label="State"
          value={state}
          onValueChange={setState}
          options={[
            { label: 'All states', value: '' },
            ...data.filters.states.map((entry) => ({ label: entry, value: entry }))
          ]}
        />
        <Select
          label="Category"
          value={category}
          onValueChange={setCategory}
          options={[
            { label: 'All categories', value: '' },
            ...data.filters.categories.map((entry) => ({ label: entry, value: entry }))
          ]}
        />
      </div>
      {data.items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.items.map((vendor) => (
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
      ) : (
        <EmptyState
          title="No vendors match those filters"
          description="Try a different state or category to broaden the directory."
        />
      )}
    </div>
  );
}
