import { notFound } from 'next/navigation';

import { buyerOrders } from '@/shared/constants/route-fixtures';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default async function BuyerOrderDetailPage({
  params
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const order = buyerOrders.find((entry) => entry.id === id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Order detail"
        title={`Order ${order.id}`}
        description={`Tracking ${order.vendor} fulfillment from the buyer perspective.`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Order snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">
            Status
            <p className="mt-2 font-semibold text-foreground">{order.status}</p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">
            Vendor
            <p className="mt-2 font-semibold text-foreground">{order.vendor}</p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">
            Total
            <p className="mt-2 font-semibold text-foreground">{order.total}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
