import { cn, formatCurrency } from '@/lib/utils';
import { Card } from '@/shared/components/ui/card';

export interface ChartPoint {
  label: string;
  value: number;
}

function buildLinePath(points: ChartPoint[], width: number, height: number) {
  if (!points.length) return '';
  const max = Math.max(...points.map((point) => point.value), 1);
  const step = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = step * index;
      const y = height - (point.value / max) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function buildAreaPath(points: ChartPoint[], width: number, height: number) {
  if (!points.length) return '';
  const line = buildLinePath(points, width, height);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

export interface RevenueChartProps {
  title?: string;
  points: ChartPoint[];
  total?: number;
  tone?: 'primary' | 'accent';
}

export function RevenueChart({
  title = 'Revenue',
  points,
  total,
  tone = 'primary'
}: RevenueChartProps) {
  const width = 320;
  const height = 120;
  const line = buildLinePath(points, width, height);
  const area = buildAreaPath(points, width, height);
  const strokeClass = tone === 'primary' ? 'text-primary-600' : 'text-accent-600';
  const fillClass = tone === 'primary' ? 'fill-primary-100/80' : 'fill-accent-100/80';

  return (
    <Card className="grid gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {typeof total === 'number' ? (
            <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {formatCurrency(total)}
            </p>
          ) : null}
        </div>
        <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground">
          Last {points.length} periods
        </div>
      </div>
      <div className="space-y-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full overflow-visible">
          <path d={area} className={fillClass} />
          <path d={line} className={cn('fill-none stroke-[3]', strokeClass)} />
        </svg>
        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
