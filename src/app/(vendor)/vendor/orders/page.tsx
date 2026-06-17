'use client';

import { useVendorOrders, useUpdateVendorOrderStatus } from '@/lib/api/hooks/useOrders';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const nextStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED'] as const;

export default function VendorOrdersPage() {
  const { data: responseData, isLoading } = useVendorOrders();
  const updateStatus = useUpdateVendorOrderStatus();

  const data = responseData?.items || [];

  if (isLoading) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Orders"
        title="Fulfillment workflow"
        description="Review incoming orders and move them through processing, shipping, and delivery status changes."
      />
      <Card>
        <CardHeader>
          <CardTitle>Incoming orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((order) => (
            <div key={order.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatCurrency(order.totalAmount, order.currency)}</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextStatuses.map((status) => (
                  <Button
                    key={status}
                    variant={order.status === status ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => void updateStatus.mutateAsync({ id: order.id, data: { status: status as any } })}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
