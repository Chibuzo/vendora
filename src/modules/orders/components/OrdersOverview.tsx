import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export function OrdersOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order history</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Route group and module boundaries are ready for customer order timelines, payment status,
        and fulfillment tracking.
      </CardContent>
    </Card>
  );
}
