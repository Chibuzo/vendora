'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { useBuyerOrders } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { routes } from '@/shared/constants/routes';
import { formatCurrency } from '@/lib/utils';

export default function BuyerOrdersPage() {
  const { data, isLoading } = useBuyerOrders();

  if (isLoading || !data) {
    return <GroupLoading />;
  }

  if (!data.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Once you complete checkout, your orders will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Orders"
        title="Buyer order history"
        description="Track payment, processing, shipping, and delivery status for every vendor order."
      />
      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((order) => (
            <Link
              key={order.id}
              href={routes.buyer.orderDetail(order.id) as Route}
              className="block rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground transition hover:bg-neutral-200"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-foreground">{order.vendor.businessName}</span>
                <span>{order.status}</span>
              </div>
              <p className="mt-2">
                {order.id} · {formatCurrency(order.totalAmount, order.currency)}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
