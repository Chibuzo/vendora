import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, Sparkles, Store } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

const highlights = [
  {
    title: 'Tenant-aware architecture',
    description:
      'Prepared for path-based or subdomain storefronts with middleware-driven tenant resolution.',
    icon: Building2
  },
  {
    title: 'Trust as a product primitive',
    description:
      'Reviews, fraud reporting, trust score signals, and vendor transparency are built into the layout.',
    icon: ShieldCheck
  },
  {
    title: 'Operational dashboards',
    description:
      'Dedicated vendor and admin surfaces create clear separation between buying and operating workflows.',
    icon: Store
  }
];

export default function LandingPage() {
  return (
    <div className="space-y-12 pb-10">
      <section className="surface overflow-hidden px-8 py-12 sm:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="secondary">Multi-tenant commerce foundation</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl">
                Vendora powers regional marketplaces without collapsing platform boundaries.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Customers discover ranked inventory, vendors operate from a dedicated back office,
                and admins supervise trust, payouts, and platform health through a single frontend
                system.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                Explore marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Access dashboard
              </Link>
            </div>
          </div>
          <div className="surface relative overflow-hidden border-0 bg-surface-inverse p-8 text-white">
            <div className="absolute inset-0 bg-panel-grid bg-[size:26px_26px] opacity-15" />
            <div className="relative space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">Platform KPI</p>
                <p className="mt-2 text-5xl font-semibold">98.6</p>
                <p className="text-sm text-white/65">Vendor trust index across active tenants</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">Search lift</p>
                  <p className="mt-2 text-2xl font-semibold">+18%</p>
                  <p className="text-sm text-white/55">Relevance tuning from reviews and fraud checks</p>
                </div>
                <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">Payout health</p>
                  <p className="mt-2 text-2xl font-semibold">99.1%</p>
                  <p className="text-sm text-white/55">Paystack-linked settlements processed on schedule</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title} hover>
            <CardHeader>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-primary-100 text-primary-700">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/login" className="text-sm font-medium text-primary-700 transition hover:text-primary-800">
                See role-aware flow
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card variant="elevated">
          <CardHeader>
            <Badge variant="secondary">Design system preview</Badge>
            <CardTitle className="mt-3">Soft tokens, clear hierarchy, future tenant overrides.</CardTitle>
            <CardDescription>
              Components consume CSS-variable tokens, so tenant branding can override color or radius without rewriting Tailwind utilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="panel-muted p-4">
              <Sparkles className="h-5 w-5 text-primary-700" />
              <p className="mt-4 text-sm font-semibold text-foreground">Tokenized color roles</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Semantic colors map through CSS variables, not raw hex values in components.</p>
            </div>
            <div className="panel-muted p-4">
              <ShieldCheck className="h-5 w-5 text-primary-700" />
              <p className="mt-4 text-sm font-semibold text-foreground">Premium spacing rhythm</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Rounded surfaces, relaxed padding, and soft shadows keep the interface calm.</p>
            </div>
            <div className="panel-muted p-4">
              <Store className="h-5 w-5 text-primary-700" />
              <p className="mt-4 text-sm font-semibold text-foreground">Shared app surfaces</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Customer, vendor, and admin layouts all pull from the same component contracts.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-inverse text-white">
          <CardHeader>
            <Badge variant="outline" className="border-white/15 bg-white/5 text-white">
              Tenant-ready theming
            </Badge>
            <CardTitle className="mt-3 text-white">Prepared for overrides</CardTitle>
            <CardDescription className="text-white/65">
              Override CSS variables at `:root` or per tenant container to shift the brand without touching component code.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-white/72">
            <pre className="overflow-x-auto rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/80">
{`:root {
  --primary: 224 29% 49%;
}

[data-tenant-theme="tenant-a"] {
  --primary: 208 28% 46%;
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
