'use client';

import { useParams, useRouter } from 'next/navigation';

import { useAddToCart, useMarketplaceProduct } from '@/modules/marketplace';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useToast } from '@/shared/components/feedback/toast';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { formatCurrency } from '@/lib/utils';
import { routes } from '@/shared/constants/routes';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, session } = useAuth();
  const addToCart = useAddToCart();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { data, isLoading } = useMarketplaceProduct(slug);

  if (isLoading) {
    return <GroupLoading />;
  }

  if (!data) {
    return <EmptyState title="Product not found" description="The requested product could not be located." />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Product detail"
        title={data.product.name}
        description={data.product.description}
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
            <img src={data.product.imageUrl} alt={data.product.name} className="h-full w-full object-cover" />
          </div>
        </div>
        <Card variant="elevated">
          <CardContent className="space-y-5 p-6">
            <Badge variant="primary">Trust {data.product.trustScore}</Badge>
            <div>
              <p className="text-sm text-muted-foreground">Vendor</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{data.product.vendor.businessName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Variants</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.product.variants.map((variant) => (
                  <span key={variant.id} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-foreground">
                    {variant.name}
                    {variant.priceDelta ? ` (+${formatCurrency(variant.priceDelta)})` : ''}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="mt-1 text-3xl font-semibold text-foreground">{formatCurrency(data.product.price, data.product.currency)}</p>
            </div>
            <Button
              width="full"
              loading={addToCart.isPending}
              onClick={() => {
                if (!isAuthenticated) {
                  router.push(`${routes.auth.login}?redirectTo=${encodeURIComponent(routes.public.productDetail(slug))}`);
                  return;
                }

                if (session?.user.role !== 'buyer') {
                  showToast({
                    title: 'Buyer account required',
                    description: 'Switch to a buyer account to add products to cart.',
                    variant: 'warning'
                  });
                  return;
                }

                void (async () => {
                  await addToCart.mutateAsync({
                    productId: data.product.id,
                    quantity: 1,
                    selectedVariantIds: data.product.variants[0] ? [data.product.variants[0].id] : []
                  });
                  showToast({
                    title: 'Added to cart',
                    description: `${data.product.name} is now in your cart.`,
                    variant: 'success'
                  });
                  router.push(routes.buyer.cart);
                })();
              }}
            >
              Add to cart
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Related products</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {data.relatedProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{formatCurrency(product.price, product.currency)}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
