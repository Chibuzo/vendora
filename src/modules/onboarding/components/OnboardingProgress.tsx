'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';

const vendorSteps = [
  { label: 'Role', href: routes.onboarding.role },
  { label: 'Business', href: routes.onboarding.vendorBusiness },
  { label: 'Location', href: routes.onboarding.vendorLocation },
  { label: 'Storefront', href: routes.onboarding.vendorStorefront },
  { label: 'First product', href: routes.onboarding.vendorFirstProduct }
];

const buyerSteps = [
  { label: 'Role', href: routes.onboarding.role },
  { label: 'Verification', href: routes.onboarding.buyerVerification },
];

export function OnboardingProgress() {
  const pathname = usePathname();
  const selectedRole = useOnboardingStore((state) => state.selectedRole);
  const steps = selectedRole === 'buyer' ? buyerSteps : vendorSteps;
  const currentIndex = Math.max(
    steps.findIndex((step) => pathname.startsWith(step.href)),
    0
  );
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span>Step {currentIndex + 1} of {steps.length}</span>
        <span>{steps[currentIndex]?.label ?? 'Onboarding'}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className={cn("grid gap-2", steps.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-5")}>
        {steps.map((step, index) => (
          <div
            key={step.href}
            className={cn(
              'rounded-[var(--radius-xl)] border px-3 py-2 text-center text-xs font-medium',
              index === currentIndex
                ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                : index < currentIndex
                ? 'border-primary-200 bg-primary-50 text-primary-800'
                : 'border-border bg-surface-muted text-muted-foreground'
            )}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
