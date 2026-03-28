'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface BottomNavItem {
  href: Route | string;
  label: string;
  icon: LucideIcon;
}

export interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-30 grid grid-cols-3 rounded-[var(--radius-pill)] border border-border/70 bg-surface/95 p-2 shadow-soft-md backdrop-blur lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              'inline-flex flex-col items-center gap-1 rounded-[var(--radius-pill)] px-3 py-2 text-xs font-medium transition',
              active ? 'bg-primary-100 text-primary-800' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
