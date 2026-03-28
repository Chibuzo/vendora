import { PaymentsOverview } from '@/modules/payments/components/PaymentsOverview';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Checkout"
        title="Checkout stays buyer-specific."
        description="Payment intent, shipping confirmation, and purchase review do not belong in shared or public layouts."
      />
      <PaymentsOverview />
      <Card>
        <CardHeader>
          <CardTitle>Checkout steps</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">1. Confirm address</div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">2. Authorize payment</div>
          <div className="rounded-[var(--radius-xl)] bg-neutral-100 p-4 text-sm text-muted-foreground">3. Review vendor fulfillment timelines</div>
        </CardContent>
      </Card>
    </div>
  );
}
