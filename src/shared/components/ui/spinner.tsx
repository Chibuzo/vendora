import * as React from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <span className={cn('inline-flex items-center justify-center', className)} {...props}>
      <LoaderCircle className={cn('animate-spin', sizeMap[size])} aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </span>
  );
}
