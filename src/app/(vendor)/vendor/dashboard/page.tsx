'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useCurrentVendor, useVendorDashboardOrders, useVendorDashboardRevenue, useVendorDashboardSummary, useVendorDashboardTopProducts } from '@/lib/api/hooks/useVendors';
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
  const { data: vendorResponse, isLoading: isLoadingVendor } = useCurrentVendor();
  const { data: summary, isLoading: isLoadingSummary } = useVendorDashboardSummary();
  const { data: revenueData, isLoading: isLoadingRevenue } = useVendorDashboardRevenue({ days: 30 });
  const { data: ordersData, isLoading: isLoadingOrders } = useVendorDashboardOrders({ days: 30 });
  const { data: topProducts, isLoading: isLoadingTopProducts } = useVendorDashboardTopProducts({ limit: 5 });
  
  const vendor = vendorResponse?.data;
  const isLoading = isLoadingVendor || isLoadingSummary || isLoadingRevenue || isLoadingOrders || isLoadingTopProducts;
  
  const nextOnboardingRoute = getNextOnboardingRoute(onboarding, session);

  useEffect(() => {
    if (!isHydrated || !nextOnboardingRoute) {
      return;
    }

    router.replace(nextOnboardingRoute as Route);
  }, [isHydrated, nextOnboardingRoute, router]);

  if (!isHydrated || nextOnboardingRoute || isLoading || !vendor || !summary) {
    return <GroupLoading variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Dashboard"
        title={`${vendor.businessName} performance`}
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
            <Link href={routes.public.vendorDetail(vendor.slug) as Route} className={buttonVariants({ variant: 'secondary' })}>
              View storefront
            </Link>
          </CardContent>
        </Card>
        <VerificationPromptCard status={vendor.verificationStatus} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Products" value={String(summary.totalProducts)} />
        <StatCard label="Orders" value={String(summary.totalOrders)} change={summary.orderGrowthPercentage} />
        <StatCard label="Trust score" value={`${vendor.trustScore || 0}/100`} change={0} />
        <StatCard label="Available balance" value={`NGN ${summary.totalRevenue.toLocaleString()}`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart points={revenueData?.points || []} total={revenueData?.totals.revenue || 0} />
        <OrdersChart points={ordersData?.points || []} total={ordersData?.totals.orders || 0} />
      </div>
      <TopProductsTable items={topProducts?.products || []} />
    </div>
  );
}
