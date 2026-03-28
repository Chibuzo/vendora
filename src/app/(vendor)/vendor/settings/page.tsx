import { SectionIntro } from '@/shared/components/layout/section-intro';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

export default function VendorSettingsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Settings"
        title="Vendor configuration"
        description="Keep storefront configuration, payout contacts, and operating defaults in one dedicated route."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Storefront defaults</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input label="Storefront name" defaultValue="GreenGrid Supplies" />
            <Input label="Support email" defaultValue="vendor@vendora.app" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Operations contacts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input label="Warehouse phone" defaultValue="+234 800 000 0000" />
            <Input label="Payout contact" defaultValue="finance@vendora.app" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
