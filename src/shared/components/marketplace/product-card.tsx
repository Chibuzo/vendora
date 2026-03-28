import type { Route } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Store } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PriceDisplay } from '@/shared/components/marketplace/price-display';
import { RatingStars } from '@/shared/components/marketplace/rating-stars';
import { TrustBadge, type TrustBadgeVariant } from '@/shared/components/marketplace/trust-badge';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  currency?: string;
  originalPrice?: number;
  vendor: string;
  rating: number;
  reviewCount?: number;
  trustStatus: TrustBadgeVariant;
  description?: string;
  category?: string;
  href?: string;
  variant?: 'grid' | 'list';
  className?: string;
}

export function ProductCard({
  image,
  name,
  price,
  currency = 'NGN',
  originalPrice,
  vendor,
  rating,
  reviewCount,
  trustStatus,
  description,
  category,
  href = '#',
  variant = 'grid',
  className
}: ProductCardProps) {
  const isList = variant === 'list';

  return (
    <Card
      hover
      className={cn(
        'overflow-hidden p-0',
        isList ? 'grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]' : 'grid',
        className
      )}
    >
      <div className={cn('overflow-hidden bg-neutral-100', isList ? 'h-full min-h-56' : 'aspect-[4/3]')}>
        <img src={image} alt={name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
      </div>
      <div className="grid gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {category ? <Badge variant="outline">{category}</Badge> : <span />}
          <TrustBadge status={trustStatus} />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <h3 className="font-display text-[1.625rem] font-semibold tracking-[-0.03em] text-foreground">{name}</h3>
            {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="h-4 w-4" />
            {vendor}
          </div>
          <RatingStars value={rating} reviewCount={reviewCount} />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <PriceDisplay amount={price} currency={currency} originalAmount={originalPrice} />
          <Link href={href as Route} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
            View details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
