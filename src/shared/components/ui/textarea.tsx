import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'w-full rounded-[var(--radius-lg)] border bg-surface px-4 py-3 text-sm text-foreground shadow-soft-xs transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/80 focus:border-primary-300 focus:outline-none focus:ring-4 focus:ring-ring/30 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'min-h-28',
        md: 'min-h-32',
        lg: 'min-h-40'
      },
      state: {
        default: 'border-border',
        error: 'border-danger-300 focus:border-danger-400 focus:ring-danger-200/60'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default'
    }
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, size, state, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? props.name ?? generatedId;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <label htmlFor={textareaId} className="grid gap-2">
        {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          disabled={props.disabled}
          className={cn(textareaVariants({ size, state: error ? 'error' : state }), className)}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
