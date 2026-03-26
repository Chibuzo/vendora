import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold tracking-[0.08em] transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-neutral-100 text-neutral-700',
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent-100 text-accent-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-danger-100 text-danger-800',
        outline: 'border border-border bg-transparent text-foreground'
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
