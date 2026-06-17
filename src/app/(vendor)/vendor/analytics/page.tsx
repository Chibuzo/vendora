'use client';

import { useVendorDashboardSummary, useVendorDashboardRevenue, useVendorDashboardOrders, useVendorDashboardTopProducts } from '@/lib/api/hooks/useVendors';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { OrdersChart } from '@/shared/components/dashboard/orders-chart';
import { RevenueChart } from '@/shared/components/dashboard/revenue-chart';
import { StatCard } from '@/shared/components/dashboard/stat-card';
import { TopProductsTable } from '@/shared/components/dashboard/top-products-table';
import { SectionIntro } from '@/shared/components/layout/section-intro';

export default function VendorAnalyticsPage() {
  const { data: summary, isLoading: isLoadingSummary } = useVendorDashboardSummary();
  const { data: revenueData, isLoading: isLoadingRevenue } = useVendorDashboardRevenue({ days: 30 });
  const { data: ordersData, isLoading: isLoadingOrders } = useVendorDashboardOrders({ days: 30 });
  const { data: topProducts, isLoading: isLoadingTopProducts } = useVendorDashboardTopProducts({ limit: 10 });

  const isLoading = isLoadingSummary || isLoadingRevenue || isLoadingOrders || isLoadingTopProducts;

  if (isLoading || !summary) {
    return <GroupLoading variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Analytics"
        title="Performance monitoring"
        description="Track revenue, order trends, product demand, and review volume across the seller lifecycle."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Revenue" value={`NGN ${summary.totalRevenue.toLocaleString()}`} />
        <StatCard label="Orders" value={String(summary.totalOrders)} />
        <StatCard label="Average rating" value={(summary.rating || 0).toFixed(1)} />
        <StatCard label="Units sold" value={String(summary.totalProducts)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart points={revenueData?.points || []} total={revenueData?.totals.revenue || 0} />
        <OrdersChart points={ordersData?.points || []} total={ordersData?.totals.orders || 0} />
      </div>
      <TopProductsTable items={topProducts?.products || []} />
    </div>
  );
}
