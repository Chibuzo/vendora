'use client';

import { GroupError } from '@/shared/components/feedback/group-error';

export default function OnboardingError({
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <GroupError
      title="Onboarding failed"
      message="The onboarding flow could not finish loading. Retry to restore the next required step."
      reset={reset}
    />
  );
}
