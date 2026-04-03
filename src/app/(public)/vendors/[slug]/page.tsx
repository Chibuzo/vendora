'use client';

import { useParams } from 'next/navigation';

import { useMarketplaceVendor } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { routes } from '@/shared/constants/routes';

export default function VendorDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { data, isLoading } = useMarketplaceVendor(slug);

  if (isLoading) {
    return <GroupLoading />;
  }

  if (!data) {
    return <EmptyState title="Vendor not found" description="The requested storefront could not be located." />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Vendor detail"
        title={data.vendor.businessName}
        description={data.vendor.description ?? ''}
      />
      <Card className="bg-surface/95">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{data.vendor.location}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.vendor.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{data.vendor.category}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.vendor.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Trust signal</p>
            <Badge className="mt-2" variant="primary">
              Trust {data.vendor.trustScore}
            </Badge>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {data.vendor.trustBreakdown.map((entry) => (
                <div key={entry.label} className="flex items-center justify-between">
                  <span>{entry.label}</span>
                  <span className="font-medium text-foreground">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Available inventory</h2>
        <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    </div>
  );
}
