import { SearchOverview } from '@/modules/search/components/SearchOverview';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Search results"
        title="Search stays public and lightweight."
        description="Keep result pages outside buyer and vendor shells so discovery remains fast and shareable."
      />
      <SearchOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Suggested queries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>`solar backup`</p>
            <p>`verified packaging vendor`</p>
            <p>`warehouse barcode scanner`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ranking inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Public search can rank by trust, freshness, vendor status, and category intent without auth chrome.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
