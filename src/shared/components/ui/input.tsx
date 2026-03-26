import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-[var(--radius-lg)] border bg-surface text-sm text-foreground shadow-soft-xs transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/80 focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-ring/30',
  {
    variants: {
      size: {
        sm: 'min-h-10 px-3',
        md: 'min-h-11 px-4',
        lg: 'min-h-12 px-5'
      },
      state: {
        default: 'border-border',
        error: 'border-danger-300 focus-within:border-danger-400 focus-within:ring-danger-200/60',
        disabled: 'border-border bg-neutral-100 text-muted-foreground'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default'
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leadingIcon,
      trailingIcon,
      id,
      disabled,
      size,
      state,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? props.name ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;
    const resolvedState = disabled ? 'disabled' : error ? 'error' : state;

    return (
      <label htmlFor={inputId} className="grid gap-2">
        {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
        <span className={cn(inputVariants({ size, state: resolvedState }), className)}>
          {leadingIcon ? <span className="mr-2 flex items-center text-muted-foreground">{leadingIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className="h-full flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
            {...props}
          />
          {trailingIcon ? <span className="ml-2 flex items-center text-muted-foreground">{trailingIcon}</span> : null}
        </span>
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
      </label>
    );
  }
);

Input.displayName = 'Input';
