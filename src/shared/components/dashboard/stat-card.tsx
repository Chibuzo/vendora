import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/shared/components/ui/card';

export interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  description?: string;
}

export function StatCard({ label, value, change, description }: StatCardProps) {
  const positive = typeof change === 'number' ? change >= 0 : undefined;

  return (
    <Card className="grid gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {typeof change === 'number' ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
              positive ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(change)}%
          </span>
        ) : null}
      </div>
      <div className="grid gap-1">
        <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">{value}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </Card>
  );
}
