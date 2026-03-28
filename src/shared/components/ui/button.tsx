import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from '@/shared/components/ui/spinner';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] border text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
  {
    variants: {
      variant: {
        primary: 'border-primary-600 bg-primary-600 text-white shadow-soft-sm hover:border-primary-700 hover:bg-primary-700',
        secondary: 'border-border/70 bg-surface text-foreground shadow-soft-xs hover:border-primary-200 hover:bg-primary-50',
        ghost: 'border-transparent bg-transparent text-foreground hover:bg-neutral-100',
        danger: 'border-danger-600 bg-danger-600 text-white shadow-soft-sm hover:border-danger-700 hover:bg-danger-700',
        outline: 'border-border/70 bg-surface/90 text-foreground shadow-soft-xs hover:bg-neutral-100',
        destructive: 'border-danger-600 bg-danger-600 text-white shadow-soft-sm hover:border-danger-700 hover:bg-danger-700'
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11 p-0'
      },
      width: {
        auto: '',
        full: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      width: 'auto'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      width,
      type = 'button',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, width }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner size="sm" className="text-current" /> : leftIcon}
        <span>{children}</span>
        {!loading ? rightIcon : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
