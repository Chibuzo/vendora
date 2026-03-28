import { RevenueChart, type RevenueChartProps } from '@/shared/components/dashboard/revenue-chart';

export function OrdersChart(props: Omit<RevenueChartProps, 'title' | 'tone'>) {
  return <RevenueChart title="Orders" tone="accent" {...props} />;
}
