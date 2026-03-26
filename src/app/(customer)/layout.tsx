import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { customerNavigation } from '@/shared/constants/navigation';

export default function CustomerLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      eyebrow="Customer workspace"
      title="Marketplace"
      description="Browse trusted inventory, manage orders, and move between shopping and operational views without visual drift."
      navigation={customerNavigation}
    >
      {children}
    </DashboardLayout>
  );
}
