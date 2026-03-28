import { Skeleton } from '@/shared/components/ui/skeleton';

export function GroupLoading({ variant = 'cards' }: Readonly<{ variant?: 'cards' | 'dashboard' }>) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className={variant === 'dashboard' ? 'grid gap-6 lg:grid-cols-3' : 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'}>
        <Skeleton className="h-48 rounded-[var(--radius-2xl)]" />
        <Skeleton className="h-48 rounded-[var(--radius-2xl)]" />
        <Skeleton className="h-48 rounded-[var(--radius-2xl)]" />
      </div>
    </div>
  );
}
