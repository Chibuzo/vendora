import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

export default function SharedProfilePage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Profile"
        title="Shared profile settings"
        description="Profile identity is shared across workspaces, which is why it sits outside the buyer and vendor groups."
      />
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" defaultValue="Amina Balogun" />
          <Input label="Email" defaultValue="buyer@vendora.app" />
        </CardContent>
      </Card>
    </div>
  );
}
