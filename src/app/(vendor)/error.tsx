'use client';

import { GroupError } from '@/shared/components/feedback/group-error';

export default function VendorError({
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <GroupError
      title="Vendor routes failed to load"
      message="The seller console hit an unexpected error. Retry to restore the vendor workspace."
      reset={reset}
    />
  );
}
