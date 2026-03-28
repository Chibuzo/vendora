import type { Route } from 'next';
import Link from 'next/link';

import { OrdersOverview } from '@/modules/orders/components/OrdersOverview';
import { buyerOrders } from '@/shared/constants/route-fixtures';
import { routes } from '@/shared/constants/routes';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function BuyerOrdersPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Orders"
        title="Buyer order history"
        description="Buyer order timelines remain independent from vendor fulfillment views at `/vendor/orders`."
      />
      <OrdersOverview />
      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {buyerOrders.map((order) => (
            <Link
              key={order.id}
              href={routes.buyer.orderDetail(order.id) as Route}
              className="block rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground transition hover:bg-neutral-200"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-foreground">{order.vendor}</span>
                <span>{order.status}</span>
              </div>
              <p className="mt-2">
                {order.id} · {order.total} · {order.date}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
