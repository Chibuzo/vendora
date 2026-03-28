'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';

export function RoleStep() {
  const router = useRouter();
  const { session } = useAuth();
  const selectedRole = useOnboardingStore((state) => state.selectedRole);
  const confirmRole = useOnboardingStore((state) => state.confirmRole);
  const [activeRole, setActiveRole] = useState<'buyer' | 'vendor'>(selectedRole ?? (session?.user.role === 'vendor' ? 'vendor' : 'buyer'));

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle>Confirm workspace role</CardTitle>
        <CardDescription>Role selection determines whether the app routes you to the buyer flow or seller console.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            role: 'buyer' as const,
            title: 'Buyer workspace',
            description: 'Discovery, repeat purchases, order tracking, and account management.'
          },
          {
            role: 'vendor' as const,
            title: 'Vendor workspace',
            description: 'Catalog setup, operations, analytics, payouts, and compliance.'
          }
        ].map((option) => (
          <button
            key={option.role}
            type="button"
            onClick={() => setActiveRole(option.role)}
            className={cn(
              'text-left',
              activeRole === option.role ? 'rounded-[var(--radius-2xl)] ring-4 ring-ring/30' : ''
            )}
          >
            <Card hover className={cn(activeRole === option.role ? 'border-primary-300 bg-primary-50' : '')}>
              <CardHeader>
                <Badge variant={activeRole === option.role ? 'primary' : 'secondary'}>
                  {option.role === 'buyer' ? 'Buyer' : 'Vendor'}
                </Badge>
                <CardTitle className="mt-3">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
      <Button
        onClick={() => {
          confirmRole(activeRole);
          router.push((activeRole === 'vendor' ? routes.onboarding.vendorSetup : routes.buyer.home) as Route);
        }}
      >
        Continue
      </Button>
    </div>
  );
}
