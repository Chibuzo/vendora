import Link from 'next/link';

import { SignupForm } from '@/modules/auth';
import { AuthLayout } from '@/shared/components/layout/auth-layout';
import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Account creation"
      title="Create a Vendora account with email or phone."
      description="Authentication establishes the session first. Profile, role, and vendor setup continue in onboarding."
      aside={
        <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-5 text-sm text-white/72">
          <p className="font-semibold text-white">Mock signup flow</p>
          <p className="mt-2">Phone OTP uses `123456` while mocks are enabled.</p>
          <p className="mt-2">
            Already registered?{' '}
            <Link href={routes.auth.login} className="text-white underline decoration-white/40 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <CardHeader className="p-0 pb-6">
        <Badge variant="secondary" size="sm">
          New account
        </Badge>
        <CardTitle className="mt-3">Start with a shared identity</CardTitle>
        <CardDescription>Buyer or vendor-specific branching happens after the session is active.</CardDescription>
      </CardHeader>
      <SignupForm />
    </AuthLayout>
  );
}
