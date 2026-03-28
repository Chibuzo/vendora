'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function Checkbox({ className, label, description, id, ...props }: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  return (
    <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-3">
      <CheckboxPrimitive.Root
        id={checkboxId}
        className={cn(
          'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-primary-700 shadow-soft-xs outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30 data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="h-3.5 w-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {(label || description) && (
        <span className="grid gap-1">
          {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
          {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
        </span>
      )}
    </label>
  );
}
