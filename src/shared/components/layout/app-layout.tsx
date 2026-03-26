import type { Route } from 'next';
import Link from 'next/link';
import { Compass, LayoutDashboard, Store } from 'lucide-react';

import { buttonVariants } from '@/shared/components/ui/button';

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Store,
  LayoutDashboard
};

const navigation = [
  { href: '/marketplace' as Route, label: 'Marketplace', icon: 'Compass' },
  { href: '/register' as Route, label: 'Sell on Vendora', icon: 'Store' },
  { href: '/admin/dashboard' as Route, label: 'Admin', icon: 'LayoutDashboard' }
];

export function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Vendora
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navigation.map(({ href, label, icon }) => {
                const Icon = ICON_MAP[icon] || Compass;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-surface hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Sign in
            </Link>
            <Link href="/register" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
              Become a vendor
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
