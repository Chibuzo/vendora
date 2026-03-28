import Link from 'next/link';

import { mockProducts } from '@/shared/constants/mock-data';
import { buyerOrders } from '@/shared/constants/route-fixtures';
import { routes } from '@/shared/constants/routes';
import { ProductCard } from '@/modules/products/components/ProductCard';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function BuyerHomePage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Buyer home"
        title="Shopping, recommendations, and order state in one buyer-specific shell."
        description="Buyer routes stay distinct from the public marketplace and vendor console, while shared surfaces like profile and notifications stay separate."
        actions={
          <Link href={routes.buyer.orders} className={buttonVariants({ variant: 'outline' })}>
            View orders
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recommended for repeat purchase</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {mockProducts.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent order activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {buyerOrders.map((order) => (
              <div key={order.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{order.vendor}</p>
                  <span className="text-sm text-muted-foreground">{order.status}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {order.id} · {order.total} · {order.date}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
