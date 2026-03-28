import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Account"
        title="Buyer account preferences"
        description="Buyer account settings stay in the buyer app, while global profile data is still available under the shared route group."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery preferences</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Save address defaults, contact preferences, and repeat vendor shortcuts.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment preferences</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Keep card authorization and wallet preferences within the buyer experience.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
