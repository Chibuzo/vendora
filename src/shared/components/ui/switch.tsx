'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function Switch({ className, label, description, id, ...props }: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  return (
    <label htmlFor={switchId} className="flex cursor-pointer items-center justify-between gap-4">
      <span className="grid gap-1">
        {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </span>
      <SwitchPrimitive.Root
        id={switchId}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-neutral-300 shadow-soft-xs outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30 data-[state=checked]:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-soft-xs transition-transform data-[state=checked]:translate-x-5" />
      </SwitchPrimitive.Root>
    </label>
  );
}
