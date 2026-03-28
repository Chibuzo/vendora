import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva('flex gap-3 rounded-[var(--radius-xl)] border p-4 shadow-soft-xs', {
  variants: {
    variant: {
      info: 'border-info-200 bg-info-50 text-info-900',
      success: 'border-success-200 bg-success-50 text-success-900',
      warning: 'border-warning-200 bg-warning-50 text-warning-900',
      danger: 'border-danger-200 bg-danger-50 text-danger-900'
    }
  },
  defaultVariants: {
    variant: 'info'
  }
});

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle
} as const;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
}

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const resolvedVariant = variant ?? 'info';
  const Icon = iconMap[resolvedVariant];

  return (
    <div className={cn(alertVariants({ variant: resolvedVariant }), className)} role="alert" {...props}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="grid gap-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? <div className="text-sm leading-6 opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}
