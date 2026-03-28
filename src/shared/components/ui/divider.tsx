import * as React from 'react';

import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export function Divider({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: DividerProps) {
  return (
    <div
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', 'bg-border/80', className)}
      {...props}
    />
  );
}
