import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export function SearchOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and ranking</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Ranking orchestration, semantic signals, and tenant-level merchandising can live here.
      </CardContent>
    </Card>
  );
}
