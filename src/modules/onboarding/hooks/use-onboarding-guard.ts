'use client';

import type { Route } from 'next';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getLoginRedirectUrl } from '@/lib/auth';
import {
  getAuthenticatedLandingRoute,
  getNextOnboardingRoute
} from '@/modules/onboarding/lib/onboarding';
import {
  selectOnboardingSnapshot,
  useOnboardingStore
} from '@/modules/onboarding/store/use-onboarding-store';
import { useAuth } from '@/modules/auth/hooks/use-auth';

export function useOnboardingGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isHydrated, session } = useAuth();
  const onboarding = useOnboardingStore(selectOnboardingSnapshot);
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!isHydrated || !hasHydrated) {
      return;
    }

    if (!session) {
      router.replace(getLoginRedirectUrl(pathname) as Route);
      return;
    }

    const nextPath = getNextOnboardingRoute(onboarding, session);

    if (!nextPath) {
      router.replace(getAuthenticatedLandingRoute(session, onboarding) as Route);
      return;
    }

    if (pathname !== nextPath) {
      router.replace(nextPath as Route);
    }
  }, [hasHydrated, isHydrated, onboarding, pathname, router, session]);

  const expectedPath = session ? getNextOnboardingRoute(onboarding, session) : null;

  return {
    isAllowed: Boolean(session) && expectedPath === pathname,
    isChecking: !isHydrated || !hasHydrated || !session || expectedPath !== pathname
  };
}
