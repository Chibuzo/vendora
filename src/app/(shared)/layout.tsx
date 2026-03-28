import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { SharedLayout } from '@/shared/components/layout/shared-layout';

export default function SharedRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SharedLayout>{children}</SharedLayout>
    </AuthGuard>
  );
}
