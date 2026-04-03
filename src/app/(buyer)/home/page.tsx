'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { useMarketplaceHome, useBuyerOrders } from '@/modules/marketplace';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { VendorCard } from '@/shared/components/marketplace/vendor-card';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { routes } from '@/shared/constants/routes';

export default function BuyerHomePage() {
  const { data: home, isLoading } = useMarketplaceHome();
  const { data: orders } = useBuyerOrders();

  if (isLoading || !home) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Buyer workspace"
        title="Continue discovery, track recent orders, and repeat trusted purchases."
        description="Your buyer shell keeps discovery, cart, checkout, and order tracking within one authenticated workspace."
      />
      <section className="space-y-4">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Recent orders</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(orders ?? []).slice(0, 3).map((order) => (
            <Link key={order.id} href={routes.buyer.orderDetail(order.id) as Route} className="rounded-[var(--radius-2xl)] border border-border/70 bg-surface p-5">
              <p className="text-sm text-muted-foreground">{order.vendor.businessName}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{order.id}</p>
              <p className="mt-3 text-sm text-muted-foreground">{order.status}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Popular vendors</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {home.popularVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              businessName={vendor.businessName}
              trustScore={vendor.trustScore}
              rating={vendor.rating}
              reviewCount={Math.max(12, Math.round(vendor.totalOrders / 3))}
              location={vendor.location}
              verificationStatus={vendor.verificationStatus === 'VERIFIED' ? 'verified' : 'high-trust'}
              tagline={vendor.description}
              href={routes.public.vendorDetail(vendor.slug)}
            />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Recommended products</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {home.recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.imageUrl}
              name={product.name}
              price={product.price}
              currency={product.currency}
              vendor={product.vendorName}
              rating={product.rating}
              reviewCount={product.reviewCount}
              trustStatus={product.trustScore >= 92 ? 'verified' : 'high-trust'}
              description={product.description}
              category={product.category}
              href={routes.public.productDetail(product.slug)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
