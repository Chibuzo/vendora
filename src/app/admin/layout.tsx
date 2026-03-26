import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { adminNavigation } from '@/shared/constants/navigation';

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      eyebrow="Platform controls"
      title="Admin console"
      description="Supervise tenant governance, trust operations, and payout health with a consistent design language."
      navigation={adminNavigation}
    >
      {children}
    </DashboardLayout>
  );
}
