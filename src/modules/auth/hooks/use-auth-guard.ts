'use client';

import type { Route } from 'next';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getLoginRedirectUrl } from '@/lib/auth';
import { useAuth } from '@/modules/auth/hooks/use-auth';

export function useAuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isHydrated, session } = useAuth();

  useEffect(() => {
    if (!isHydrated || session) {
      return;
    }

    router.replace(getLoginRedirectUrl(pathname) as Route);
  }, [isHydrated, pathname, router, session]);

  return {
    isAllowed: Boolean(session),
    isChecking: !isHydrated || !session,
    session
  };
}
