'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import {
  useBuyerCart,
  useCreateOrder,
  useInitializePayment
} from '@/modules/marketplace';
import type { OrderView } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { useToast } from '@/shared/components/feedback/toast';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { routes } from '@/shared/constants/routes';

const enableMocks = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { session } = useAuth();
  const { data: cart, isLoading } = useBuyerCart();
  const createOrder = useCreateOrder();
  const initializePayment = useInitializePayment();
  const [deliveryAddress, setDeliveryAddress] = useState('24 Admiralty Way, Lekki Phase 1, Lagos');

  const groupedItems = useMemo(() => {
    const groups = new Map<string, NonNullable<typeof cart>['items']>();

    for (const item of cart?.items ?? []) {
      const current = groups.get(item.product.vendorId) ?? [];
      current.push(item);
      groups.set(item.product.vendorId, current);
    }

    return [...groups.entries()];
  }, [cart?.items]);

  if (isLoading || !cart) {
    return <GroupLoading />;
  }

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Add products to your cart before starting payment."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Checkout"
        title="Confirm delivery details and initialize payment."
        description="Orders are grouped by vendor for fulfillment, then a single payment authorization is created for the total basket."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Delivery address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Address" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {groupedItems.map(([vendorId, items]) => (
              <div key={vendorId} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
                <p className="font-medium text-foreground">{items[0]?.product.vendorName}</p>
                <p className="mt-2">{items.length} items</p>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{formatCurrency(cart.subtotal, cart.currency)}</span>
            </div>
            <Button
              width="full"
              loading={createOrder.isPending || initializePayment.isPending}
              onClick={() => {
                void (async () => {
                  const createdOrders: OrderView[] = [];

                  for (const [vendorId, items] of groupedItems) {
                    const order = await createOrder.mutateAsync({
                      vendorId,
                      deliveryAddress,
                      items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        selectedVariantIds: item.selectedVariantIds
                      }))
                    });
                    createdOrders.push(order);
                  }

                  const payment = await initializePayment.mutateAsync({
                    amount: cart.subtotal,
                    email: session?.user.email
                  });

                  showToast({
                    title: enableMocks ? 'Mock payment completed' : 'Payment initialized',
                    description: enableMocks
                      ? `Reference ${payment.reference} was approved for ${createdOrders.length} vendor order${createdOrders.length === 1 ? '' : 's'}.`
                      : `Reference ${payment.reference} is ready.`,
                    variant: 'success'
                  });

                  if (enableMocks) {
                    const firstOrder = createdOrders[0];
                    router.push((firstOrder ? routes.buyer.orderDetail(firstOrder.id) : routes.buyer.orders) as Route);
                    router.refresh();
                    return;
                  }

                  window.location.assign(payment.authorizationUrl);
                })();
              }}
            >
              Pay with Paystack
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
