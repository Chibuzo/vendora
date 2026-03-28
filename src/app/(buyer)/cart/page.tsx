import type { Route } from 'next';
import Link from 'next/link';

import { SectionIntro } from '@/shared/components/layout/section-intro';
import { routes } from '@/shared/constants/routes';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function CartPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Cart"
        title="Cart state belongs to the buyer shell."
        description="The drawer is global to the buyer layout, while this route expands the same intent into a full review page."
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Items in cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">Solar Backup Kit · NGN 280,000</div>
            <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">Premium Packaging Set · NGN 25,000</div>
            <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">Warehouse Barcode Scanner · NGN 67,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">NGN 372,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery estimate</span>
              <span className="font-semibold text-foreground">NGN 8,000</span>
            </div>
            <Link href={routes.buyer.checkout as Route} className={buttonVariants({ variant: 'primary' })}>
              Proceed to checkout
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
