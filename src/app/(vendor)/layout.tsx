import { RoleGuard } from '@/modules/auth/components/RoleGuard';
import { vendorNavigation } from '@/shared/constants/navigation';
import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';

export default function VendorRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard role="vendor">
      <DashboardLayout
        eyebrow="Vendor console"
        title="Seller workspace"
        description="Catalog management, payouts, analytics, and operations stay inside a dedicated vendor shell."
        navigation={vendorNavigation}
      >
        {children}
      </DashboardLayout>
    </RoleGuard>
  );
}
