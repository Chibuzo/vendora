'use client';

import Link from 'next/link';
import {
  Bell,
  Boxes,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShoppingBag,
  Store
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import type { NavigationItem } from '@/shared/constants/navigation';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger
} from '@/shared/components/ui/dropdown';
import { Input } from '@/shared/components/ui/input';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Building2,
  ShoppingBag,
  Boxes,
  Store
};

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

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:px-8">
        <aside className="surface flex h-fit flex-col gap-8 p-6 xl:sticky xl:top-6">
          <div className="space-y-5">
            <Link href="/" className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
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
              const active = pathname === href;
              const Icon = ICON_MAP[icon] || LayoutDashboard;

              return (
                <Link
                  key={href}
                  href={href}
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
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <header className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
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
              <Dropdown>
                <DropdownTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-2.5 text-left transition hover:border-primary-200"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>VD</AvatarFallback>
                    </Avatar>
                    <span className="hidden min-w-0 sm:block">
                      <span className="block text-sm font-medium text-foreground">Vendora Ops</span>
                      <span className="block text-xs text-muted-foreground">Platform workspace</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownTrigger>
                <DropdownContent align="end">
                  <DropdownLabel>Account</DropdownLabel>
                  <DropdownItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem className="text-danger-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </header>

          <main className="min-w-0 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
