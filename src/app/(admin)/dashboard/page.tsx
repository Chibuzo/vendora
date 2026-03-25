import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export default function AdminDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin tooling scaffold</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p>Extend this area with trust investigations, payout oversight, search curation, and tenant governance.</p>
        <p>The middleware already enforces role-aware access for `/admin` paths.</p>
      </CardContent>
    </Card>
  );
}
