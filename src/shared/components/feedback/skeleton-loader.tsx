import * as React from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/shared/components/ui/skeleton';

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  showAvatar?: boolean;
}

export function SkeletonLoader({
  className,
  lines = 3,
  showAvatar = false,
  ...props
}: SkeletonLoaderProps) {
  return (
    <div className={cn('surface grid gap-4 p-5', className)} {...props}>
      <div className="flex items-center gap-3">
        {showAvatar ? <Skeleton className="h-12 w-12 rounded-full" /> : null}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" variant="subtle" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className={cn('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')} variant="subtle" />
        ))}
      </div>
    </div>
  );
}
