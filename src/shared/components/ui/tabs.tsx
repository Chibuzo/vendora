'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const tabsListVariants = cva('inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-neutral-100 p-1', {
  variants: {
    size: {
      sm: 'h-10',
      md: 'h-11'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const Tabs = TabsPrimitive.Root;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export function TabsList({ className, size, ...props }: TabsListProps) {
  return <TabsPrimitive.List className={cn(tabsListVariants({ size }), className)} {...props} />;
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium text-muted-foreground transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-soft-xs',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-6 rounded-[var(--radius-xl)] focus-visible:outline-none', className)}
      {...props}
    />
  );
}
