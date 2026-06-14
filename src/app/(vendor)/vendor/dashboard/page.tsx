'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useVendorDashboard } from '@/modules/marketplace';
import { getNextOnboardingRoute } from '@/modules/onboarding/lib/onboarding';
import { selectOnboardingSnapshot, useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { VerificationPromptCard } from '@/modules/onboarding/components/VerificationPromptCard';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { OrdersChart } from '@/shared/components/dashboard/orders-chart';
import { RevenueChart } from '@/shared/components/dashboard/revenue-chart';
import { StatCard } from '@/shared/components/dashboard/stat-card';
import { TopProductsTable } from '@/shared/components/dashboard/top-products-table';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { routes } from '@/shared/constants/routes';

export default function VendorDashboardPage() {
  const router = useRouter();
  const { isHydrated, session } = useAuth();
  const onboarding = useOnboardingStore(useShallow(selectOnboardingSnapshot));
  const { data, isLoading } = useVendorDashboard();
  const nextOnboardingRoute = getNextOnboardingRoute(onboarding, session);

  useEffect(() => {
    if (!isHydrated || !nextOnboardingRoute) {
      return;
    }

    router.replace(nextOnboardingRoute as Route);
  }, [isHydrated, nextOnboardingRoute, router]);

  if (!isHydrated || nextOnboardingRoute || isLoading || !data) {
    return <GroupLoading variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Dashboard"
        title={`${data.vendor.businessName} performance`}
        description="Your store is live. Monitor the essentials, add products, and improve trust signals from one seller workspace."
      />
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <Badge variant="success">Onboarding complete</Badge>
            <CardTitle className="mt-3 text-2xl">Your storefront is ready for buyers.</CardTitle>
            <CardDescription>
              Business profile, location, and launch setup are complete. Verification is optional and can be done anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href={routes.vendor.newProduct as Route} className={buttonVariants()}>
              Add product
            </Link>
            <Link href={routes.vendor.verification as Route} className={buttonVariants({ variant: 'outline' })}>
              Complete verification
            </Link>
            <Link href={routes.public.vendorDetail(data.vendor.slug) as Route} className={buttonVariants({ variant: 'secondary' })}>
              View storefront
            </Link>
          </CardContent>
        </Card>
        <VerificationPromptCard status={data.vendor.verificationStatus} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Products" value={String(data.stats.productCount)} />
        <StatCard label="Orders" value={String(data.stats.orders)} change={8} />
        <StatCard label="Trust score" value={`${data.stats.trustScore}/100`} change={3} />
        <StatCard label="Available balance" value={`NGN ${data.stats.balance.toLocaleString()}`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart points={data.revenuePoints} total={data.stats.revenue} />
        <OrdersChart points={data.orderPoints} total={data.stats.orders} />
      </div>
      <TopProductsTable items={data.topProducts} />
    </div>
  );
}
