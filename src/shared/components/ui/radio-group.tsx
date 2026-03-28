'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/lib/utils';

export const RadioGroup = RadioGroupPrimitive.Root;

export interface RadioOptionProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export function RadioOption({ className, label, description, id, ...props }: RadioOptionProps) {
  const generatedId = React.useId();
  const itemId = id ?? generatedId;

  return (
    <label htmlFor={itemId} className="flex cursor-pointer items-start gap-3">
      <RadioGroupPrimitive.Item
        id={itemId}
        className={cn(
          'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface shadow-soft-xs outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary-600',
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <span className="grid gap-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  );
}
