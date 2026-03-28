import type { Route } from 'next';
import Link from 'next/link';

import { SectionIntro } from '@/shared/components/layout/section-intro';
import { vendorDirectory } from '@/shared/constants/route-fixtures';
import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Vendor listing"
        title="Browse storefronts by trust score and specialty."
        description="This public route stays optimized for discovery and ranking, not operations."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {vendorDirectory.map((vendor) => (
          <Card key={vendor.slug} hover>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant="primary">Trust {vendor.trustScore}</Badge>
                <span className="text-sm text-muted-foreground">{vendor.location}</span>
              </div>
              <CardTitle className="mt-3">{vendor.name}</CardTitle>
              <CardDescription>{vendor.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">{vendor.description}</p>
              <Link href={routes.public.vendorDetail(vendor.slug) as Route} className="text-sm font-medium text-primary-700">
                Open vendor profile
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
