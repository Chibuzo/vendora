import { VendorVerificationStep } from '@/modules/onboarding/components/VendorVerificationStep';
import { SectionIntro } from '@/shared/components/layout/section-intro';

export default function VendorVerificationPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Trust"
        title="Complete verification"
        description="Submit trust details without blocking your active storefront."
      />
      <div className="surface p-6 sm:p-8">
        <VendorVerificationStep />
      </div>
    </div>
  );
}
