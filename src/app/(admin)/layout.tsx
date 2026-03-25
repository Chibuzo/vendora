import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { adminNavigation } from '@/shared/constants/navigation';

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardShell eyebrow="Platform controls" title="Admin console" navigation={adminNavigation}>
      {children}
    </DashboardShell>
  );
}
