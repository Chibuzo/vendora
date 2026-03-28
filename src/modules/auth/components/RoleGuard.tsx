'use client';

import type { PropsWithChildren } from 'react';

import type { UserRole } from '@/lib/auth';
import { useRoleGuard } from '@/modules/auth/hooks/use-role-guard';
import { GuardFallback } from '@/shared/components/feedback/guard-fallback';

interface RoleGuardProps extends PropsWithChildren {
  role: Exclude<UserRole, 'admin'>;
}

export function RoleGuard({ role, children }: Readonly<RoleGuardProps>) {
  const { isAllowed, isChecking } = useRoleGuard(role);

  if (!isAllowed) {
    return <GuardFallback label={isChecking ? 'Checking workspace access' : 'Redirecting'} />;
  }

  return children;
}
