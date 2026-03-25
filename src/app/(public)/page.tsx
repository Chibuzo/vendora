import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, Store } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

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
    <div className="space-y-12">
      <section className="surface overflow-hidden px-8 py-12 sm:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
              Multi-tenant commerce foundation
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
                Vendora powers regional marketplaces without collapsing platform boundaries.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Customers discover ranked inventory, vendors operate from a dedicated back office,
                and admins supervise trust, payouts, and platform health through a single frontend
                system.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Explore marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
              >
                Access dashboard
              </Link>
            </div>
          </div>
          <div className="surface relative overflow-hidden border-0 bg-ink p-8 text-white">
            <div className="absolute inset-0 bg-hero-grid bg-[size:26px_26px] opacity-20" />
            <div className="relative space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Platform KPI</p>
                <p className="mt-2 text-5xl font-semibold">98.6</p>
                <p className="text-sm text-slate-300">Vendor trust index across active tenants</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Search lift</p>
                  <p className="mt-2 text-2xl font-semibold">+18%</p>
                  <p className="text-sm text-slate-400">Relevance tuning from reviews and fraud checks</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Payout health</p>
                  <p className="mt-2 text-2xl font-semibold">99.1%</p>
                  <p className="text-sm text-slate-400">Paystack-linked settlements processed on schedule</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
