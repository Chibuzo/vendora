import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

import { vendorDirectory } from '@/shared/constants/route-fixtures';
import { routes } from '@/shared/constants/routes';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { VendorCard } from '@/shared/components/marketplace/vendor-card';
import { DesignSystemShowcase } from '@/shared/components/showcase/design-system-showcase';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { mockProducts } from '@/shared/constants/mock-data';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="surface overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <SectionIntro
          eyebrow="Public discovery"
          title="A marketplace shell that cleanly separates discovery, onboarding, and operating workspaces."
          description="Public routes stay focused on exploration and trust. Authentication, onboarding, buyer workflows, and vendor operations all branch into dedicated route groups instead of sharing the same shell."
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
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[var(--radius-xl)] bg-primary-50 p-5">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <p className="mt-4 font-semibold text-foreground">Trust-aware discovery</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Vendor trust and verification stay visible before users ever sign in.
            </p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-accent-100 p-5">
            <Sparkles className="h-5 w-5 text-accent-800" />
            <p className="mt-4 font-semibold text-foreground">Lean public shell</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Navigation, search, and footer live here, and nowhere else.
            </p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-5">
            <Badge variant="secondary">App Router</Badge>
            <p className="mt-4 font-semibold text-foreground">Collision-free route design</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Vendor operations sit under `/vendor/*` to avoid collisions with public catalog routes.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionIntro
          eyebrow="Featured vendors"
          title="Verified operators ready for repeat buyers."
          description="Public vendor detail routes surface credibility signals before buyers commit to a transaction."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {vendorDirectory.map((vendor) => (
            <VendorCard
              key={vendor.slug}
              businessName={vendor.name}
              trustScore={vendor.trustScore}
              rating={Math.min(5, Math.max(4.1, vendor.trustScore / 20))}
              reviewCount={Math.round(vendor.trustScore * 1.2)}
              location={vendor.location}
              verificationStatus={vendor.trustScore >= 92 ? 'verified' : 'high-trust'}
              tagline={vendor.specialty}
              href={routes.public.vendorDetail(vendor.slug)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionIntro
          eyebrow="Featured products"
          title="Catalog discovery stays in the public group."
          description="Products can be explored without loading buyer or vendor-specific chrome."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {mockProducts.slice(0, 3).map((product, index) => (
            <ProductCard
              key={product.id}
              image={product.imageUrl}
              name={product.name}
              price={product.price}
              currency={product.currency}
              vendor={product.vendorName}
              rating={4.2 + index * 0.2}
              reviewCount={44 + index * 21}
              trustStatus={product.trustScore >= 92 ? 'verified' : 'high-trust'}
              description={product.description}
              category={product.category}
            />
          ))}
        </div>
      </section>

      <DesignSystemShowcase />
    </div>
  );
}
