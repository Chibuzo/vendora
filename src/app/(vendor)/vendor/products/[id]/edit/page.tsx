import { notFound } from 'next/navigation';

import { mockProducts } from '@/shared/constants/mock-data';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

export default async function EditVendorProductPage({
  params
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const product = mockProducts.find((entry) => entry.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Edit product"
        title={`Update ${product.name}`}
        description="Vendor editing routes remain nested under the vendor app and never collide with public product detail routes."
      />
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Product configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input label="Product name" defaultValue={product.name} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Category" defaultValue={product.category} />
            <Input label="Price" defaultValue={String(product.price)} />
          </div>
          <Textarea label="Description" defaultValue={product.description} />
          <Button>Update product</Button>
        </CardContent>
      </Card>
    </div>
  );
}
