import type { Route } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SearchInput } from '@/shared/components/discovery/search-input';
import { Button, buttonVariants } from '@/shared/components/ui/button';

export interface NavbarItem {
  href: Route | string;
  label: string;
  icon?: LucideIcon;
}

export interface NavbarProps {
  brandHref: Route | string;
  brandLabel: string;
  items: NavbarItem[];
  activeHref?: string;
  searchPlaceholder?: string;
  suggestions?: string[];
  secondaryAction?: { href: Route | string; label: string };
  primaryAction?: { href: Route | string; label: string };
  actionSlot?: React.ReactNode;
}

export function Navbar({
  brandHref,
  brandLabel,
  items,
  activeHref,
  searchPlaceholder = 'Search trusted vendors, products, or categories',
  suggestions,
  secondaryAction,
  primaryAction,
  actionSlot
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={brandHref as Route}
            className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground"
          >
            {brandLabel}
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            {secondaryAction ? (
              <Link href={secondaryAction.href as Route} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                {secondaryAction.label}
              </Link>
            ) : null}
            {primaryAction ? (
              <Link href={primaryAction.href as Route} className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                {primaryAction.label}
              </Link>
            ) : null}
            {actionSlot}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,420px)] lg:items-center lg:justify-between">
          <nav className="flex flex-wrap items-center gap-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = activeHref === item.href || activeHref?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                    active ? 'bg-primary-100 text-primary-800' : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <SearchInput placeholder={searchPlaceholder} suggestions={suggestions} />
        </div>
        <div className="flex items-center gap-3 sm:hidden">
          {secondaryAction ? (
            <Link href={secondaryAction.href as Route} className={buttonVariants({ variant: 'secondary', size: 'sm', width: 'full' })}>
              {secondaryAction.label}
            </Link>
          ) : null}
          {primaryAction ? (
            <Link href={primaryAction.href as Route} className={buttonVariants({ variant: 'primary', size: 'sm', width: 'full' })}>
              {primaryAction.label}
            </Link>
          ) : null}
          {!secondaryAction && !primaryAction && actionSlot ? <Button variant="secondary" size="sm">{actionSlot}</Button> : null}
        </div>
      </div>
    </header>
  );
}
