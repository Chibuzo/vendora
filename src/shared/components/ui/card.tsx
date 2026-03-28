import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-[var(--radius-2xl)] border border-border/70 bg-card/95 text-card-foreground shadow-soft-sm transition-[box-shadow,transform,border-color] duration-200',
  {
    variants: {
      variant: {
        elevated: 'shadow-soft-md',
        outline: 'shadow-soft-xs',
        ghost: 'border-transparent bg-surface-muted shadow-none'
      },
      hover: {
        true: 'hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft-lg',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'outline',
      hover: false
    }
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, hover, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, hover }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2 p-6 pb-0', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'font-display text-[1.625rem] font-semibold leading-tight tracking-[-0.03em] text-card-foreground',
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between gap-3 p-6 pt-0', className)} {...props} />;
}
