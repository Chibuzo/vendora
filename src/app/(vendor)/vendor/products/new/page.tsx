import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

export default function NewVendorProductPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="New product"
        title="Create inventory without leaving the vendor shell."
        description="Route-level code splitting keeps product creation isolated from the rest of the dashboard."
      />
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input label="Product name" placeholder="Cold Chain Storage Box" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Category" placeholder="Logistics" />
            <Input label="Price" placeholder="142000" />
          </div>
          <Textarea label="Description" placeholder="Temperature-controlled container for last-mile delivery." />
          <Button>Save product draft</Button>
        </CardContent>
      </Card>
    </div>
  );
}
