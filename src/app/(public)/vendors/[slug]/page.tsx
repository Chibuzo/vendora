import { notFound } from 'next/navigation';

import { mockProducts } from '@/shared/constants/mock-data';
import { vendorDirectory } from '@/shared/constants/route-fixtures';
import { ProductCard } from '@/modules/products/components/ProductCard';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';

export default async function VendorDetailPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const vendor = vendorDirectory.find((entry) => entry.slug === slug);

  if (!vendor) {
    notFound();
  }

  const featuredProducts = mockProducts.filter((product) => product.vendorName === vendor.name).slice(0, 2);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Vendor detail"
        title={vendor.name}
        description={vendor.description}
      />
      <Card className="bg-surface/95">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{vendor.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Specialty</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{vendor.specialty}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Trust signal</p>
            <Badge className="mt-2" variant="primary">
              Trust {vendor.trustScore}
            </Badge>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Featured inventory</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
