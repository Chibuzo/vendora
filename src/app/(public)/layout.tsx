import { PublicHeader } from '@/shared/components/layout/PublicHeader';

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
