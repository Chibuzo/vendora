import { AppLayout } from '@/shared/components/layout/app-layout';

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
