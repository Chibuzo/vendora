'use client';

import { useState } from 'react';

import { useVendorPayouts, useWithdrawVendorBalance } from '@/modules/marketplace';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { formatCurrency } from '@/lib/utils';

export default function VendorPayoutsPage() {
  const { data, isLoading } = useVendorPayouts();
  const withdraw = useWithdrawVendorBalance();
  const [amount, setAmount] = useState('');

  if (isLoading || !data) {
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
            <p className="text-3xl font-semibold text-foreground">{formatCurrency(data.balance.availableBalance, data.balance.currency)}</p>
            <p className="text-sm text-muted-foreground">Pending: {formatCurrency(data.balance.pendingBalance, data.balance.currency)}</p>
            <Input label="Withdraw amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            <Button loading={withdraw.isPending} onClick={() => void withdraw.mutateAsync(Number(amount || 0))}>
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payout history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.payouts.map((payout) => (
              <div key={payout.id} className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{payout.reference}</p>
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
