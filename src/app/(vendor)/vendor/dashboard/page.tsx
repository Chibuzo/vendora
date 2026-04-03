'use client';

import { useVendorDashboard } from '@/modules/marketplace';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { OrdersChart } from '@/shared/components/dashboard/orders-chart';
import { RevenueChart } from '@/shared/components/dashboard/revenue-chart';
import { StatCard } from '@/shared/components/dashboard/stat-card';
import { TopProductsTable } from '@/shared/components/dashboard/top-products-table';
import { SectionIntro } from '@/shared/components/layout/section-intro';

export default function VendorDashboardPage() {
  const { data, isLoading } = useVendorDashboard();

  if (isLoading || !data) {
    return <GroupLoading variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Dashboard"
        title={`${data.vendor.businessName} performance`}
        description="Monitor revenue, order activity, trust posture, and available balance from one seller workspace."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Revenue" value={`NGN ${data.stats.revenue.toLocaleString()}`} change={12} />
        <StatCard label="Orders" value={String(data.stats.orders)} change={8} />
        <StatCard label="Rating" value={data.stats.rating.toFixed(1)} change={3} />
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
