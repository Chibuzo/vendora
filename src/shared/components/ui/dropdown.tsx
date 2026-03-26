'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export const Dropdown = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownGroup = DropdownMenu.Group;
export const DropdownPortal = DropdownMenu.Portal;
export const DropdownSub = DropdownMenu.Sub;
export const DropdownRadioGroup = DropdownMenu.RadioGroup;

export function DropdownContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-56 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-1.5 shadow-soft-lg',
          className
        )}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function DropdownItem({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Item> & { inset?: boolean }) {
  return (
    <DropdownMenu.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-foreground outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-neutral-100',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

export function DropdownLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Label> & { inset?: boolean }) {
  return (
    <DropdownMenu.Label
      className={cn(
        'px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

export function DropdownSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>) {
  return <DropdownMenu.Separator className={cn('my-1 h-px bg-border', className)} {...props} />;
}

export function DropdownSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenu.SubTrigger
      className={cn(
        'flex cursor-default select-none items-center rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-foreground outline-none transition data-[state=open]:bg-neutral-100',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenu.SubTrigger>
  );
}

export function DropdownSubContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.SubContent>) {
  return (
    <DropdownMenu.SubContent
      className={cn(
        'z-50 min-w-48 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-1.5 shadow-soft-lg',
        className
      )}
      {...props}
    />
  );
}
