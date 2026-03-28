'use client';

import { useEffect } from 'react';

import type { Session } from '@/lib/auth';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';

export function OnboardingBootstrap({ initialSession }: Readonly<{ initialSession: Session | null }>) {
  const activeUserId = useOnboardingStore((state) => state.activeUserId);
  const initializeForSession = useOnboardingStore((state) => state.initializeForSession);

  useEffect(() => {
    if (!initialSession || activeUserId === initialSession.user.id) {
      return;
    }

    initializeForSession(initialSession);
  }, [activeUserId, initialSession, initializeForSession]);

  return null;
}
