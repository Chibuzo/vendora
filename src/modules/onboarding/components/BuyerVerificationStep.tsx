'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useVendorOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

export function BuyerVerificationStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const completeOnboarding = useVendorOnboardingStore((state) => state.completeOnboarding);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate API call for verification
    setTimeout(() => {
      completeOnboarding();
      showToast({
        title: 'Verification successful',
        description: 'Your buyer account is ready.',
        variant: 'success'
      });
      router.push(routes.public.home as Route);
      router.refresh();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle>Verify your account</CardTitle>
        <CardDescription>
          Please enter the verification code sent to your email or phone number.
        </CardDescription>
      </CardHeader>
      <div className="space-y-4">
        <Input
          label="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
        />
      </div>
      <Button
        loading={isLoading}
        onClick={handleVerify}
        disabled={!code || code.length < 6}
      >
        Verify and Continue
      </Button>
    </div>
  );
}
