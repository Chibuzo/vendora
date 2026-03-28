'use client';

import type { PropsWithChildren } from 'react';

import { useOnboardingGuard } from '@/modules/onboarding/hooks/use-onboarding-guard';
import { GuardFallback } from '@/shared/components/feedback/guard-fallback';

export function OnboardingGuard({ children }: PropsWithChildren) {
  const { isAllowed, isChecking } = useOnboardingGuard();

  if (!isAllowed) {
    return <GuardFallback label={isChecking ? 'Preparing your onboarding flow' : 'Redirecting'} />;
  }

  return children;
}
