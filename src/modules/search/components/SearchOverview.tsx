import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function SearchOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and ranking</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Ranking orchestration, semantic signals, and tenant-level merchandising can live here.
      </CardContent>
    </Card>
  );
}
