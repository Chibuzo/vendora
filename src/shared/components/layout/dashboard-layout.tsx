'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronLeft, LayoutDashboard, LogOut, Menu, Search, Settings, X } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/modules/auth';
import type { NavigationItem } from '@/shared/constants/navigation';
import { iconMap } from '@/shared/constants/navigation';
import { routes } from '@/shared/constants/routes';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  navigation: NavigationItem[];
  children: React.ReactNode;
}

export function DashboardLayout({
  eyebrow,
  title,
  description,
  navigation,
  children
}: Readonly<DashboardLayoutProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout, isLogoutPending } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initials = session?.user.name
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 xl:px-8">
        <div
          className={cn(
            'fixed inset-0 z-40 bg-overlay/30 backdrop-blur-sm transition xl:hidden',
            isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={cn(
            'surface fixed inset-y-4 left-4 z-50 flex w-[280px] flex-col gap-8 p-6 transition xl:sticky xl:top-6 xl:z-auto xl:h-[calc(100vh-3rem)] xl:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[115%]'
          )}
        >
          <div className="flex items-center justify-between xl:hidden">
            <Link href={routes.vendor.dashboard as Route} className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Vendora
            </Link>
            <button type="button" className="rounded-full border border-border p-2" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5">
            <Link href={routes.vendor.dashboard as Route} className="hidden font-display text-2xl font-semibold tracking-[-0.04em] text-foreground xl:inline-flex">
              Vendora
            </Link>
            <div className="space-y-3">
              <Badge variant="secondary">{eyebrow}</Badge>
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          <nav className="grid gap-2">
            {navigation.map(({ href, label, icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              const Icon = iconMap[icon] || LayoutDashboard;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'inline-flex items-center gap-3 rounded-[var(--radius-xl)] px-4 py-3 text-sm font-medium transition',
                    active
                      ? 'bg-primary-50 text-primary-800 shadow-soft-xs'
                      : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[var(--radius-xl)] bg-primary-50 p-4 text-sm text-primary-900">
            <p className="font-semibold">Need a buyer view?</p>
            <Link href={routes.buyer.home as Route} className="mt-2 inline-flex items-center gap-2 text-primary-700 transition hover:text-primary-800">
              <ChevronLeft className="h-4 w-4" />
              Open buyer workspace
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6 xl:pl-0">
          <header className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Button variant="outline" size="sm" className="xl:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
                Menu
              </Button>
              <Input
                className="max-w-xl"
                placeholder="Search orders, vendors, payouts, or SKUs"
                leadingIcon={<Search className="h-4 w-4" />}
                aria-label="Search dashboard"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-2.5">
                <Avatar size="sm">
                  <AvatarFallback>{initials || 'VD'}</AvatarFallback>
                </Avatar>
                <span className="hidden min-w-0 sm:block">
                  <span className="block text-sm font-medium text-foreground">{session?.user.name || 'Vendora Ops'}</span>
                  <span className="block text-xs text-muted-foreground">
                    {session ? `${session.user.role} workspace` : 'Platform workspace'}
                  </span>
                </span>
                <Link href={routes.vendor.settings as Route} className="rounded-full p-2 text-muted-foreground transition hover:bg-neutral-100 hover:text-foreground">
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-neutral-100 hover:text-danger-700"
                  onClick={() => {
                    void (async () => {
                      await logout().catch(() => null);
                      window.location.href = routes.public.home;
                    })();
                  }}
                  disabled={isLogoutPending}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
