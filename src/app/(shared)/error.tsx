'use client';

import { GroupError } from '@/shared/components/feedback/group-error';

export default function SharedError({
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <GroupError
      title="Shared routes failed to load"
      message="The shared cross-role surface hit an unexpected error. Retry to continue."
      reset={reset}
    />
  );
}
