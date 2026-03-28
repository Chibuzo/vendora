import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

import { mockProducts } from '@/shared/constants/mock-data';
import { vendorDirectory } from '@/shared/constants/route-fixtures';
import { routes } from '@/shared/constants/routes';
import { ProductCard } from '@/modules/products/components/ProductCard';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

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
          description="Public vendor detail routes give buyers enough trust context before crossing into authenticated flows."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {vendorDirectory.map((vendor) => (
            <Card key={vendor.slug} hover>
              <CardHeader>
                <Badge variant="primary">Trust {vendor.trustScore}</Badge>
                <CardTitle className="mt-3">{vendor.name}</CardTitle>
                <CardDescription>{vendor.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">{vendor.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{vendor.location}</span>
                  <Link href={routes.public.vendorDetail(vendor.slug) as Route} className="font-medium text-primary-700">
                    View vendor
                  </Link>
                </div>
              </CardContent>
            </Card>
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
          {mockProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
