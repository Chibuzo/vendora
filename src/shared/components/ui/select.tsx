'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-[var(--radius-lg)] border bg-surface text-sm text-foreground shadow-soft-xs transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4 focus:ring-ring/30 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-muted-foreground data-[placeholder]:text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'h-10 px-3',
        md: 'h-11 px-4',
        lg: 'h-12 px-4'
      },
      state: {
        default: 'border-border focus:border-primary-300',
        error: 'border-danger-300 focus:border-danger-400 focus:ring-danger-200/60'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default'
    }
  }
);

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
      'defaultValue' | 'value' | 'onValueChange'
    >,
    VariantProps<typeof selectTriggerVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Select({
  label,
  helperText,
  error,
  placeholder = 'Select an option',
  options,
  size,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectProps) {
  const generatedId = React.useId();
  const helperId = helperText ? `${generatedId}-helper` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;

  return (
    <div className="grid gap-2">
      {label ? <label className="text-sm font-medium text-foreground">{label}</label> : null}
      <SelectPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} {...props}>
        <SelectPrimitive.Trigger
          className={cn(selectTriggerVariants({ size, state: error ? 'error' : 'default' }))}
          aria-invalid={Boolean(error)}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-card/95 p-1 shadow-soft-lg backdrop-blur"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex cursor-default select-none items-center rounded-[var(--radius-md)] py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-900"
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-3 inline-flex items-center text-primary-700">
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error ? (
        <span id={errorId} className="text-sm text-danger-700">
          {error}
        </span>
      ) : null}
      {!error && helperText ? (
        <span id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
