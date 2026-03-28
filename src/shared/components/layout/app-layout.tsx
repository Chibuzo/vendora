import type { Route } from 'next';
import Link from 'next/link';
import { Search, Sparkles, Store } from 'lucide-react';

import { publicNavigation, iconMap } from '@/shared/constants/navigation';
import { routes } from '@/shared/constants/routes';
import { buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(195,206,241,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,232,223,0.5),transparent_28%)]">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href={routes.public.home} className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Vendora
            </Link>
            <div className="flex items-center gap-3">
              <Link href={routes.auth.login as Route} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Sign in
              </Link>
              <Link href={routes.auth.signup as Route} className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                Join Vendora
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap items-center gap-2">
              {publicNavigation.map(({ href, label, icon }) => {
                const Icon = iconMap[icon] || Store;

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
            <div className="flex items-center gap-3 lg:w-[420px]">
              <Input
                aria-label="Search products and vendors"
                placeholder="Search products, vendors, or categories"
                leadingIcon={<Search className="h-4 w-4" />}
              />
              <div className="hidden items-center gap-2 rounded-full bg-accent-100 px-3 py-2 text-xs font-semibold tracking-[0.08em] text-accent-800 sm:inline-flex">
                <Sparkles className="h-3.5 w-3.5" />
                Discovery mode
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="border-t border-border/70 bg-surface/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Vendora marketplace surfaces for buyer discovery and tenant-ready merchandising.</p>
          <div className="flex items-center gap-4">
            <Link href={routes.public.vendors as Route} className="transition hover:text-foreground">
              Vendors
            </Link>
            <Link href={routes.public.products as Route} className="transition hover:text-foreground">
              Products
            </Link>
            <Link href={routes.public.search as Route} className="transition hover:text-foreground">
              Search
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
