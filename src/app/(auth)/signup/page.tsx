import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight, Store, UserRound } from 'lucide-react';

import { AuthLayout } from '@/shared/components/layout/auth-layout';
import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Account creation"
      title="Create an account without leaking buyer and vendor concerns together."
      description="Signup stays minimal. Role-specific branching happens in onboarding, not in the auth shell itself."
    >
      <div className="space-y-6">
        <div>
          <Badge variant="secondary" size="sm">
            Account intent
          </Badge>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
            Start with a shared identity, choose your path next.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-surface/95">
            <CardHeader>
              <UserRound className="h-5 w-5 text-primary-700" />
              <CardTitle className="mt-3">Buyer-first account</CardTitle>
              <CardDescription>Discover products, manage orders, and return to repeat purchases quickly.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-surface/95">
            <CardHeader>
              <Store className="h-5 w-5 text-primary-700" />
              <CardTitle className="mt-3">Vendor-ready account</CardTitle>
              <CardDescription>Progress through setup, location, and verification before opening the seller console.</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 p-6">
              <Link href={routes.auth.login as Route} className={buttonVariants({ variant: 'outline' })}>
                Already have an account
              </Link>
            <Link href={routes.onboarding.profile as Route} className={buttonVariants({ variant: 'primary' })}>
              Continue to onboarding
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
