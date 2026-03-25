import { VendorProfilePanel } from '@/modules/vendors';

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Vendor dashboard</p>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Monitor storefront health, trust, and fulfillment velocity.
        </h1>
      </div>
      <VendorProfilePanel />
    </div>
  );
}
