import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export function ReviewsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews and moderation</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Add buyer feedback streams, moderation queues, and review analytics in this domain.
      </CardContent>
    </Card>
  );
}
