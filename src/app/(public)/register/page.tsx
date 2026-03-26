import Link from 'next/link';

import { OnboardingRequestModal } from '@/modules/auth/components/OnboardingRequestModal';
import { AuthLayout } from '@/shared/components/layout/auth-layout';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Vendor onboarding"
      title="Launch a calm, trustworthy seller experience."
      description="Use this layout for future KYC, payout, compliance, and tenant registration flows without leaking dashboard concerns into public routes."
    >
      <CardHeader className="p-0 pb-6">
        <Badge variant="secondary" size="sm">
          Design system usage
        </Badge>
        <CardTitle className="mt-3">Vendor onboarding starts at the backend boundary</CardTitle>
        <CardDescription>
          This page demonstrates the auth shell plus the modal, input, and textarea primitives in a production-ready composition.
        </CardDescription>
      </CardHeader>
      <div className="flex flex-wrap items-center gap-3">
        <OnboardingRequestModal />
        <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
          Return to login
        </Link>
      </div>
    </AuthLayout>
  );
}
