'use client';

import type { Route } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import type { UserRole } from '@/lib/auth';
import { useAuthGuard } from '@/modules/auth/hooks/use-auth-guard';
import { useOnboardingStore, selectOnboardingSnapshot } from '@/modules/onboarding/store/use-onboarding-store';
import { getAuthenticatedLandingRoute } from '@/modules/onboarding/lib/onboarding';

export function useRoleGuard(role: Exclude<UserRole, 'admin'>) {
  const router = useRouter();
  const auth = useAuthGuard();
  const onboarding = useOnboardingStore(useShallow(selectOnboardingSnapshot));

  useEffect(() => {
    if (auth.isChecking || !auth.session || auth.session.user.role === role) {
      return;
    }

    router.replace(getAuthenticatedLandingRoute(auth.session, onboarding) as Route);
  }, [auth.isChecking, auth.session, onboarding, role, router]);

  const isAllowed = auth.session?.user.role === role;

  return {
    isAllowed,
    isChecking: auth.isChecking || (Boolean(auth.session) && !isAllowed),
    session: auth.session
  };
}
