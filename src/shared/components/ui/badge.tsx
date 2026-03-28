import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-3 py-1 text-xs font-semibold tracking-[0.08em] transition-colors',
  {
    variants: {
      variant: {
        neutral: 'border-transparent bg-neutral-100 text-neutral-700',
        primary: 'border-transparent bg-primary-100 text-primary-800',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        accent: 'border-transparent bg-accent-100 text-accent-800',
        success: 'border-transparent bg-success-100 text-success-800',
        info: 'border-transparent bg-info-100 text-info-800',
        warning: 'border-transparent bg-warning-100 text-warning-800',
        danger: 'border-transparent bg-danger-100 text-danger-800',
        outline: 'border-border bg-transparent text-foreground'
      },
      size: {
        sm: 'px-2.5 py-1 text-[0.6875rem]',
        md: 'px-3 py-1 text-xs'
      }
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
