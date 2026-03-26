'use client';

import { ShieldCheck, Wallet, Zap } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { TrustScoreBadge } from '@/modules/vendors/components/TrustScoreBadge';
import { useVendorProfile } from '@/modules/vendors/hooks/use-vendor-profile';
import { formatPayoutStatus } from '@/modules/vendors/services/vendor-service';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

const metricCards = [
  {
    key: 'lifetimeRevenue',
    label: 'Lifetime revenue',
    icon: Wallet
  },
  {
    key: 'completionRate',
    label: 'Completion rate',
    icon: ShieldCheck
  },
  {
    key: 'responseTimeInMinutes',
    label: 'Response time',
    icon: Zap
  }
] as const;

export function VendorProfilePanel() {
  const { data, isLoading } = useVendorProfile();

  if (isLoading || !data) {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="h-[320px] rounded-[var(--radius-2xl)]" />
        <Skeleton className="h-[320px] rounded-[var(--radius-2xl)]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary" size="sm">
              Store performance
            </Badge>
            <CardTitle className="mt-3">{data.businessName}</CardTitle>
            <CardDescription>{`${data.ownerName} / ${data.category} vendor`}</CardDescription>
          </div>
          <TrustScoreBadge score={data.trustScore} />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {metricCards.map(({ key, label, icon: Icon }) => (
            <div key={key} className="panel-muted p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                {key === 'lifetimeRevenue' && formatCurrency(data.lifetimeRevenue)}
                {key === 'completionRate' && `${data.completionRate}%`}
                {key === 'responseTimeInMinutes' && `${data.responseTimeInMinutes} min`}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Badge variant="secondary" size="sm">
            Settlement posture
          </Badge>
          <CardTitle className="mt-3">Operational snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="rounded-[var(--radius-xl)] bg-primary-50 p-5">
            <p className="font-semibold text-foreground">Payout status</p>
            <p className="mt-1">{formatPayoutStatus(data.payoutStatus)}</p>
          </div>
          <div className="panel-muted p-5">
            <p className="font-semibold text-foreground">Monthly orders</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{data.monthlyOrders}</p>
          </div>
          <div className="panel-muted p-5">
            <p className="font-semibold text-foreground">Verification</p>
            <p className="mt-1">{data.verified ? 'KYC approved and storefront verified.' : 'Verification pending.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
