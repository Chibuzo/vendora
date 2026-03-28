'use client';

import type { PropsWithChildren } from 'react';

import { useAuthGuard } from '@/modules/auth/hooks/use-auth-guard';
import { GuardFallback } from '@/shared/components/feedback/guard-fallback';

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAllowed, isChecking } = useAuthGuard();

  if (!isAllowed) {
    return <GuardFallback label={isChecking ? 'Checking your session' : 'Redirecting to login'} />;
  }

  return children;
}
