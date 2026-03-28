import * as React from 'react';
import { Inbox } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  title,
  description,
  icon,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'surface grid justify-items-center gap-4 px-6 py-10 text-center',
        className
      )}
      {...props}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <div className="grid gap-2">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
