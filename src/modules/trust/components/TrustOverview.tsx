import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function TrustOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust operations</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Keep fraud reports, verification flags, and trust rules isolated in this domain.
      </CardContent>
    </Card>
  );
}
