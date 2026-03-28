import { notFound } from 'next/navigation';

import { mockProducts } from '@/shared/constants/mock-data';
import { vendorDirectory } from '@/shared/constants/route-fixtures';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/lib/utils';

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function ProductDetailPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const product = mockProducts.find((entry) => toSlug(entry.name) === slug);

  if (!product) {
    notFound();
  }

  const vendor = vendorDirectory.find((entry) => entry.name === product.vendorName);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Product detail"
        title={product.name}
        description={product.description}
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </div>
        <Card variant="elevated">
          <CardContent className="space-y-5 p-6">
            <Badge variant="primary">Trust {product.trustScore}</Badge>
            <div>
              <p className="text-sm text-muted-foreground">Vendor</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{product.vendorName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="mt-1 text-3xl font-semibold text-foreground">{formatCurrency(product.price, product.currency)}</p>
            </div>
            {vendor ? (
              <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm leading-6 text-muted-foreground">
                Sold by <span className="font-semibold text-foreground">{vendor.name}</span> in {vendor.location}.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
