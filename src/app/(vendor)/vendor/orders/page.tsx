import { OrdersOverview } from '@/modules/orders/components/OrdersOverview';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function VendorOrdersPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Orders"
        title="Fulfillment workflow"
        description="Vendor orders are intentionally isolated from buyer order history, even though both speak about the same transactions."
      />
      <OrdersOverview />
      <Card>
        <CardHeader>
          <CardTitle>Operational queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">3 orders awaiting packaging confirmation</div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">2 orders waiting on dispatch partner pickup</div>
        </CardContent>
      </Card>
    </div>
  );
}
