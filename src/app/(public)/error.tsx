'use client';

import { GroupError } from '@/shared/components/feedback/group-error';

export default function PublicError({
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <GroupError
      title="Public routes failed to load"
      message="The discovery surface hit an unexpected error. Retry the route to continue browsing."
      reset={reset}
    />
  );
}
