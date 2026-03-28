import type { Route } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';

import { RatingStars } from '@/shared/components/marketplace/rating-stars';
import { TrustBadge, type TrustBadgeVariant } from '@/shared/components/marketplace/trust-badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export interface VendorCardProps {
  businessName: string;
  trustScore: number;
  rating: number;
  location: string;
  verificationStatus: TrustBadgeVariant;
  reviewCount?: number;
  href?: string;
  tagline?: string;
}

export function VendorCard({
  businessName,
  trustScore,
  rating,
  location,
  verificationStatus,
  reviewCount,
  href = '#',
  tagline
}: VendorCardProps) {
  const initials = businessName
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card hover className="grid gap-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-foreground">{businessName}</h3>
            {tagline ? <p className="text-sm text-muted-foreground">{tagline}</p> : null}
          </div>
        </div>
        <TrustBadge status={verificationStatus} />
      </div>
      <div className="grid gap-3">
        <div className="inline-flex w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary-800">
          Trust score {trustScore}
        </div>
        <RatingStars value={rating} reviewCount={reviewCount} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
      </div>
      <Link href={href as Route} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
        View vendor
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
