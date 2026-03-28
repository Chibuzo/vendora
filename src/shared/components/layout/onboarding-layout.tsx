'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { routes } from '@/shared/constants/routes';

const steps = [
  { label: 'Profile', href: routes.onboarding.profile },
  { label: 'Role', href: routes.onboarding.role },
  { label: 'Setup', href: routes.onboarding.vendorSetup },
  { label: 'Location', href: routes.onboarding.vendorLocation },
  { label: 'Verification', href: routes.onboarding.vendorVerification }
];

export function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const currentIndex = Math.max(
    steps.findIndex((step) => pathname.startsWith(step.href)),
    0
  );
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <Link href={routes.public.home} className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Vendora
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Complete the setup flow before we place you into the buyer or vendor workspace.
          </p>
        </div>
        <div className="surface space-y-5 p-6 sm:p-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>Onboarding progress</span>
              <span>
                {currentIndex + 1} / {steps.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid gap-2 sm:grid-cols-5">
              {steps.map((step, index) => (
                <div
                  key={step.href}
                  className={cn(
                    'rounded-[var(--radius-xl)] border px-3 py-2 text-center text-xs font-medium',
                    index <= currentIndex
                      ? 'border-primary-200 bg-primary-50 text-primary-800'
                      : 'border-border bg-surface-muted text-muted-foreground'
                  )}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
