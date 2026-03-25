import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export function AnalyticsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics domain</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Track vendor funnels, retention, and revenue cohorts from a dedicated analytics module.
      </CardContent>
    </Card>
  );
}
