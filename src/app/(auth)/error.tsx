'use client';

import { GroupError } from '@/shared/components/feedback/group-error';

export default function AuthError({
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <GroupError
      title="Authentication route failed"
      message="The auth surface could not load. Retry to restore login and signup flows."
      reset={reset}
    />
  );
}
