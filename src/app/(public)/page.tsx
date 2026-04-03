'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import { useMarketplaceHome } from '@/modules/marketplace';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { VendorCard } from '@/shared/components/marketplace/vendor-card';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { routes } from '@/shared/constants/routes';

export default function HomePage() {
  const { data, isLoading } = useMarketplaceHome();

  if (isLoading || !data) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-10">
      <section className="surface overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <SectionIntro
          eyebrow="Marketplace"
          title="Search trusted vendors, compare products, and move from discovery to checkout without leaving the flow."
          description="Vendora separates public discovery, onboarding, buyer operations, and vendor management into dedicated route groups while keeping the entry experience fast."
          actions={
            <>
              <Link href={routes.public.products as Route} className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                Browse products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={routes.auth.signup as Route} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Create account
              </Link>
            </>
          }
        />
        <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[var(--radius-2xl)] bg-primary-50 p-5">
            <Input
              aria-label="Search marketplace"
              placeholder="Search for verified packaging vendors, solar kits, warehouse tools..."
              leadingIcon={<Search className="h-4 w-4" />}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <Link key={category} href={`${routes.public.search}?category=${encodeURIComponent(category)}`} className="rounded-full bg-white px-3 py-1 text-sm text-foreground shadow-soft-xs">
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-[var(--radius-2xl)] bg-accent-100 p-5">
            <Badge variant="accent">Trust-first discovery</Badge>
            <p className="mt-4 text-lg font-semibold text-foreground">Popular vendors and recommended products stay visible before sign-in.</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The same catalog then powers buyer search, cart, checkout, and vendor order fulfillment.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionIntro
          eyebrow="Popular vendors"
          title="Verified storefronts ready for repeat buyers."
          description="Browse vendors by trust score, location, and category before you commit to checkout."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {data.popularVendors.map((vendor) => (
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

      <section className="space-y-6">
        <SectionIntro
          eyebrow="Recommended products"
          title="High-trust inventory buyers can act on immediately."
          description="Each product entry links directly into its detail page, variants, vendor trust context, and add-to-cart flow."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {data.recommendedProducts.map((product) => (
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
