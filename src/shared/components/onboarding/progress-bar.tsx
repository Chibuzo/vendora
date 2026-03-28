import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <div className={cn('h-2 w-full rounded-full bg-neutral-200', className)} aria-hidden="true">
      <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width }} />
    </div>
  );
}
