'use client';

import { useVendorAnalytics } from '@/modules/marketplace';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { OrdersChart } from '@/shared/components/dashboard/orders-chart';
import { RevenueChart } from '@/shared/components/dashboard/revenue-chart';
import { StatCard } from '@/shared/components/dashboard/stat-card';
import { TopProductsTable } from '@/shared/components/dashboard/top-products-table';
import { SectionIntro } from '@/shared/components/layout/section-intro';

export default function VendorAnalyticsPage() {
  const { data, isLoading } = useVendorAnalytics();

  if (isLoading || !data) {
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
        <StatCard label="Revenue" value={`NGN ${data.summary.totalRevenue.toLocaleString()}`} />
        <StatCard label="Orders" value={String(data.summary.totalOrders)} />
        <StatCard label="Average rating" value={data.summary.averageRating.toFixed(1)} />
        <StatCard label="Units sold" value={String(data.summary.totalUnitsSold)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart points={data.revenuePoints} total={data.summary.totalRevenue} />
        <OrdersChart points={data.orderPoints} total={data.summary.totalOrders} />
      </div>
      <TopProductsTable items={data.topProducts} />
    </div>
  );
}
