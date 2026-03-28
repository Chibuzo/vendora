import { RoleGuard } from '@/modules/auth/components/RoleGuard';
import { BuyerLayout } from '@/shared/components/layout/buyer-layout';

export default function BuyerRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard role="buyer">
      <BuyerLayout>{children}</BuyerLayout>
    </RoleGuard>
  );
}
