'use client';

import type { Session } from '@/lib/auth';
import { AuthBootstrap } from '@/modules/auth/components/AuthBootstrap';
import { OnboardingBootstrap } from '@/modules/onboarding/components/OnboardingBootstrap';

export function AuthProvider({
  initialSession,
  children
}: Readonly<{
  initialSession: Session | null;
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthBootstrap initialSession={initialSession} />
      <OnboardingBootstrap initialSession={initialSession} />
      {children}
    </>
  );
}
