'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ShoppingCart } from 'lucide-react';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useCartStore } from '@/modules/cart/store/use-cart-store';
import { buyerNavigation, iconMap } from '@/shared/constants/navigation';
import { routes } from '@/shared/constants/routes';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants, Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';

export function BuyerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { session } = useAuth();
  const initials = session?.user.name
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const itemCount = useCartStore((state) => state.itemCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const closeDrawer = useCartStore((state) => state.closeDrawer);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href={routes.buyer.home as Route} className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Vendora
            </Link>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground"
                aria-label="Open cart"
                onClick={toggleDrawer}
              >
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 px-2 py-0.5" variant="primary" size="sm">
                  {itemCount}
                </Badge>
              </button>
              <Link href={routes.shared.profile as Route} className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-2">
                <Avatar size="sm">
                  <AvatarFallback>{initials || 'BY'}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground sm:inline">{session?.user.name || 'Buyer'}</span>
              </Link>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <Input
              aria-label="Buyer search"
              placeholder="Search trusted vendors, top products, or repeat purchases"
            />
            <nav className="hidden items-center gap-2 md:flex">
              {buyerNavigation.map(({ href, label, icon }) => {
                const Icon = iconMap[icon];
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                      active
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-overlay/25 backdrop-blur-sm transition',
          isDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeDrawer}
      />
      <aside
        className={cn(
          'surface fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-md p-6 transition',
          isDrawerOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Cart drawer</p>
            <p className="text-sm text-muted-foreground">{itemCount} active items</p>
          </div>
          <Button variant="ghost" size="sm" onClick={closeDrawer}>
            Close
          </Button>
        </div>
        <div className="mt-6 space-y-4 text-sm">
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
            <p className="font-medium text-foreground">Repeat purchase shortlist</p>
            <p className="mt-2 text-muted-foreground">
              Solar Backup Kit, Packaging Set, and Barcode Scanner remain in your cart state.
            </p>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <Link href={routes.buyer.checkout as Route} className={buttonVariants({ variant: 'primary', size: 'md' })}>
            Continue to checkout
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-4 bottom-4 z-30 grid grid-cols-3 rounded-[var(--radius-pill)] border border-border/70 bg-surface/95 p-2 shadow-soft-md backdrop-blur md:hidden">
        {buyerNavigation.map(({ href, label, icon }) => {
          const Icon = iconMap[icon];
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'inline-flex flex-col items-center gap-1 rounded-[var(--radius-pill)] px-3 py-2 text-xs font-medium transition',
                active ? 'bg-primary-100 text-primary-800' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
