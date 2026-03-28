'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SidebarItem {
  href: Route | string;
  label: string;
  icon?: LucideIcon;
  caption?: string;
}

export interface SidebarProps {
  title: string;
  description?: string;
  items: SidebarItem[];
}

export function Sidebar({ title, description, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="surface hidden h-fit w-full max-w-[280px] shrink-0 p-4 lg:block">
      <div className="px-2 pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={cn(
                'rounded-[var(--radius-xl)] px-4 py-3 transition',
                active ? 'bg-primary-50 text-primary-900 shadow-soft-xs' : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.caption ? <p className="mt-1 pl-7 text-sm leading-6 opacity-80">{item.caption}</p> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
