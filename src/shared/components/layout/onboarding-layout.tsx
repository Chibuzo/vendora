'use client';

import Link from 'next/link';

import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress';
import { routes } from '@/shared/constants/routes';

export function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <Link href={routes.public.home} className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Vendora
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Choose your workspace and add only the details needed to make a vendor storefront useful.
          </p>
        </div>
        <div className="surface space-y-5 p-6 sm:p-8">
          <OnboardingProgress />
          {children}
        </div>
      </div>
    </div>
  );
}
