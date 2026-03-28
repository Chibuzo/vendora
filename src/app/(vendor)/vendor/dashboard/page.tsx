import { AnalyticsOverview } from '@/modules/analytics/components/AnalyticsOverview';
import { OrdersOverview } from '@/modules/orders/components/OrdersOverview';
import { VendorProfilePanel } from '@/modules/vendors/components/VendorProfilePanel';
import { SectionIntro } from '@/shared/components/layout/section-intro';

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Dashboard"
        title="Vendor dashboard"
        description="A high-level seller surface that aggregates storefront health, demand, and fulfillment posture."
      />
      <VendorProfilePanel />
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsOverview />
        <OrdersOverview />
      </div>
    </div>
  );
}
