import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface RatingStarsProps {
  value: number;
  reviewCount?: number;
  className?: string;
}

export function RatingStars({ value, reviewCount, className }: RatingStarsProps) {
  const rating = Math.min(5, Math.max(0, value));
  const width = `${(rating / 5) * 100}%`;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className="flex text-neutral-300">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-4 w-4" />
          ))}
        </div>
        <div className="absolute inset-0 overflow-hidden text-warning-500" style={{ width }}>
          <div className="flex w-max">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)}
        {typeof reviewCount === 'number' ? ` (${reviewCount})` : ''}
      </span>
    </div>
  );
}
