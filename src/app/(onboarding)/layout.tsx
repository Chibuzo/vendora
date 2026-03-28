import { OnboardingGuard } from '@/modules/onboarding/components/OnboardingGuard';
import { OnboardingLayout } from '@/shared/components/layout/onboarding-layout';

export default function OnboardingRouteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OnboardingGuard>
      <OnboardingLayout>{children}</OnboardingLayout>
    </OnboardingGuard>
  );
}
