import { VendorProfilePanel } from '@/modules/vendors';
import { Badge } from '@/shared/components/ui/badge';

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary" size="sm">
          Vendor dashboard
        </Badge>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Monitor storefront health, trust, and fulfillment velocity.
        </h1>
      </div>
      <VendorProfilePanel />
    </div>
  );
}
