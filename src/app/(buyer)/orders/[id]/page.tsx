'use client';

import { useParams } from 'next/navigation';

import { useBuyerOrder } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default function BuyerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : '';
  const { data, isLoading } = useBuyerOrder(id);

  if (isLoading) {
    return <GroupLoading />;
  }

  if (!data) {
    return <EmptyState title="Order not found" description="The requested order could not be located." />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Order detail"
        title={`Order ${data.id}`}
        description={`Tracking ${data.vendor.businessName} fulfillment from the buyer perspective.`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Status timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.timeline.map((step) => (
            <div key={step.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">{step.title}</p>
                <span className="text-sm text-muted-foreground">{step.completedAt ? new Date(step.completedAt).toLocaleString() : 'Pending'}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Order snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">
            Status
            <p className="mt-2 font-semibold text-foreground">{data.status}</p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">
            Vendor
            <p className="mt-2 font-semibold text-foreground">{data.vendor.businessName}</p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">
            Total
            <p className="mt-2 font-semibold text-foreground">{formatCurrency(data.totalAmount, data.currency)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
