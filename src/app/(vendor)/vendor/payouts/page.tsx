'use client';

import { useState } from 'react';

import { useVendorPayouts, useCurrentVendorBalance, useRequestVendorPayout } from '@/lib/api/hooks/useVendors';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { formatCurrency } from '@/lib/utils';

export default function VendorPayoutsPage() {
  const { data: payoutsResponse, isLoading: isLoadingPayouts } = useVendorPayouts();
  const { data: balance, isLoading: isLoadingBalance } = useCurrentVendorBalance();
  const withdraw = useRequestVendorPayout();
  const [amount, setAmount] = useState('');

  const payouts = payoutsResponse?.items || [];
  const isLoading = isLoadingPayouts || isLoadingBalance;

  if (isLoading || !balance) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Payouts"
        title="Settlement and payout health"
        description="Track balances, payout history, and request withdrawals without leaving the vendor dashboard."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold text-foreground">{formatCurrency(balance.availableAmount, balance.currency)}</p>
            <p className="text-sm text-muted-foreground">Pending: {formatCurrency(balance.pendingAmount, balance.currency)}</p>
            <Input label="Withdraw amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            <Button loading={withdraw.isPending} onClick={() => void withdraw.mutateAsync({ amount: Number(amount || 0) })}>
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payout history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{payout.reference || payout.id}</p>
                  <span className="text-sm text-muted-foreground">{payout.status}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{formatCurrency(payout.amount, payout.currency)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
