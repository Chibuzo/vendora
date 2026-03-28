import { AnalyticsOverview } from '@/modules/analytics/components/AnalyticsOverview';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Analytics"
        title="Performance monitoring"
        description="Heavy analytics stay route-split behind the vendor layout to keep the base dashboard shell light."
      />
      <AnalyticsOverview />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Monitor revenue changes without loading catalog forms.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order conversion</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Separate conversion reporting from fulfillment tooling.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Identify SKUs worth restocking or promoting.</CardContent>
        </Card>
      </div>
    </div>
  );
}
