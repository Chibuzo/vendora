import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

export default function RegisterPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Vendor onboarding starts at the backend boundary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-slate-600">
        <p>
          Add onboarding flows here for tenant registration, KYC, payout setup, and compliance
          review. The route group is already separated so public onboarding can evolve without
          leaking dashboard concerns into customer flows.
        </p>
        <Link href="/login" className="text-sm font-semibold text-brand-700 transition hover:text-brand-800">
          Return to login
        </Link>
      </CardContent>
    </Card>
  );
}
