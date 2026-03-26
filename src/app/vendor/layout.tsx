import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { vendorNavigation } from '@/shared/constants/navigation';

export default function VendorLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      eyebrow="Vendor operations"
      title="Seller console"
      description="Track storefront health, trust posture, and settlement performance from a single operating surface."
      navigation={vendorNavigation}
    >
      {children}
    </DashboardLayout>
  );
}
