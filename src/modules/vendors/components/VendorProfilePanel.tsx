'use client';

import { ShieldCheck, Wallet, Zap } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { TrustScoreBadge } from '@/modules/vendors/components/TrustScoreBadge';
import { useVendorProfile } from '@/modules/vendors/hooks/use-vendor-profile';
import { formatPayoutStatus } from '@/modules/vendors/services/vendor-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

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
    return <p className="text-sm text-slate-500">Loading vendor profile...</p>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Store performance</p>
            <CardTitle>{data.businessName}</CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              {data.ownerName} · {data.category} vendor
            </p>
          </div>
          <TrustScoreBadge score={data.trustScore} />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {metricCards.map(({ key, label, icon: Icon }) => (
            <div key={key} className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-ink">
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
          <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Settlement posture</p>
          <CardTitle>Operational snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-3xl bg-brand-50 p-5">
            <p className="font-semibold text-ink">Payout status</p>
            <p className="mt-1">{formatPayoutStatus(data.payoutStatus)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="font-semibold text-ink">Monthly orders</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.monthlyOrders}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="font-semibold text-ink">Verification</p>
            <p className="mt-1">{data.verified ? 'KYC approved and storefront verified.' : 'Verification pending.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
