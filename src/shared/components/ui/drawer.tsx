'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

export function DrawerPortal({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Dialog.Portal>{children}</Dialog.Portal>;
}

export function DrawerOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn('fixed inset-0 z-40 bg-overlay/30 backdrop-blur-sm', className)}
      {...props}
    />
  );
}

export interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: 'left' | 'right' | 'bottom';
}

export function DrawerContent({ className, children, side = 'right', ...props }: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Dialog.Content
        className={cn(
          'fixed z-50 flex flex-col border border-border/70 bg-card/95 p-6 shadow-soft-lg backdrop-blur-xl focus:outline-none',
          side === 'right' && 'inset-y-4 right-4 w-[calc(100vw-2rem)] max-w-md rounded-[var(--radius-2xl)]',
          side === 'left' && 'inset-y-4 left-4 w-[calc(100vw-2rem)] max-w-md rounded-[var(--radius-2xl)]',
          side === 'bottom' && 'inset-x-4 bottom-4 max-h-[85vh] rounded-[var(--radius-2xl)]',
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-neutral-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30">
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Close drawer</span>
        </Dialog.Close>
      </Dialog.Content>
    </DrawerPortal>
  );
}

export function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-2 pr-10', className)} {...props} />;
}

export function DrawerTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      className={cn('font-display text-2xl font-semibold tracking-[-0.03em] text-card-foreground', className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Description>) {
  return <Dialog.Description className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end', className)} {...props} />;
}
