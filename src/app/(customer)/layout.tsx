import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { customerNavigation } from '@/shared/constants/navigation';

export default function CustomerLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardShell
      eyebrow="Customer workspace"
      title="Marketplace"
      navigation={customerNavigation}
    >
      {children}
    </DashboardShell>
  );
}
