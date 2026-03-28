'use client';

import { GroupError } from '@/shared/components/feedback/group-error';

export default function BuyerError({
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <GroupError
      title="Buyer routes failed to load"
      message="The buyer workspace hit an unexpected error. Retry to restore shopping and order management."
      reset={reset}
    />
  );
}
