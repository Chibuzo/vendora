'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { useBuyerCart, useRemoveCartItem, useUpdateCartItem } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { CartItemCard } from '@/shared/components/marketplace/cart-item-card';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { routes } from '@/shared/constants/routes';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { data: cart, isLoading } = useBuyerCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading || !cart) {
    return <GroupLoading />;
  }

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products from the catalog to build an order."
        action={
          <Link href={routes.public.products as Route} className={buttonVariants({ variant: 'primary' })}>
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Cart"
        title="Review cart items before checkout."
        description="Adjust quantities, remove items, and confirm the current subtotal before you continue to payment."
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              image={item.product.imageUrl}
              name={item.product.name}
              vendor={item.product.vendorName}
              quantity={item.quantity}
              price={item.unitPrice}
              currency={cart.currency}
              onDecrease={() => {
                if (item.quantity === 1) {
                  void removeItem.mutateAsync(item.id);
                  return;
                }

                void updateItem.mutateAsync({
                  itemId: item.id,
                  quantity: item.quantity - 1
                });
              }}
              onIncrease={() => {
                void updateItem.mutateAsync({
                  itemId: item.id,
                  quantity: item.quantity + 1
                });
              }}
            />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{formatCurrency(cart.subtotal, cart.currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery estimate</span>
              <span className="font-semibold text-foreground">{formatCurrency(8000, cart.currency)}</span>
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
