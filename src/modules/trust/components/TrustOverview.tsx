import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export function TrustOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust operations</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Keep fraud reports, verification flags, and trust rules isolated in this domain.
      </CardContent>
    </Card>
  );
}
