'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { getAuthenticatedLandingRoute } from '@/modules/onboarding/lib/onboarding';
import { selectOnboardingSnapshot, useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';

export function SharedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { session } = useAuth();
  const onboarding = useOnboardingStore(useShallow(selectOnboardingSnapshot));
  const backHref = getAuthenticatedLandingRoute(session, onboarding);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <Badge variant="secondary">Shared workspace</Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Cross-role surfaces
            </h1>
          </div>
          <Link href={(backHref || routes.buyer.home) as Route} className="text-sm font-medium text-primary-700 transition hover:text-primary-800">
            Return to workspace
          </Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
