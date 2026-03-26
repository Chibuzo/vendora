import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function PaymentsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments module</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Reserve this layer for checkout intents, Paystack authorization flows, and settlement history.
      </CardContent>
    </Card>
  );
}
