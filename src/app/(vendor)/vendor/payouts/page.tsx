import { PaymentsOverview } from '@/modules/payments/components/PaymentsOverview';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function VendorPayoutsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Payouts"
        title="Settlement and payout health"
        description="Payout timelines and banking configuration stay inside the vendor dashboard where they belong."
      />
      <PaymentsOverview />
      <Card>
        <CardHeader>
          <CardTitle>Latest settlement status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">Next payout window: Monday, 09:00 WAT</div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4">Account health: verified and eligible for scheduled transfers</div>
        </CardContent>
      </Card>
    </div>
  );
}
