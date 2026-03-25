import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { vendorNavigation } from '@/shared/constants/navigation';

export default function VendorLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardShell eyebrow="Vendor operations" title="Seller console" navigation={vendorNavigation}>
      {children}
    </DashboardShell>
  );
}
