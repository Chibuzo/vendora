'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useSubmitVendorVerification } from '@/modules/onboarding/hooks/use-vendor-onboarding-api';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

interface VerificationFormValues {
  cacNumber: string;
}

export function VendorVerificationStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const submitVerification = useOnboardingStore((state) => state.submitVerification);
  const verificationMutation = useSubmitVendorVerification();
  const form = useForm<VerificationFormValues>({
    defaultValues: {
      cacNumber: ''
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          try {
            await verificationMutation.mutateAsync({
              cacNumber: values.cacNumber
            });
            submitVerification({
              verificationNotes: values.cacNumber
            });
            showToast({
              title: 'Verification submitted',
              description: 'Your vendor dashboard is now unlocked.',
              variant: 'success'
            });
            router.push(routes.vendor.dashboard as Route);
          } catch (error) {
            showToast({
              title: 'Verification not submitted',
              description: error instanceof Error ? error.message : 'Check the details and try again.',
              variant: 'danger'
            });
          }
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Submit verification package</CardTitle>
        <CardDescription>Capture the final seller context needed before opening the vendor dashboard.</CardDescription>
      </CardHeader>
      <Input
        label="CAC number"
        placeholder="RC-4455602"
        error={form.formState.errors.cacNumber?.message}
        {...form.register('cacNumber', { required: 'CAC number is required.' })}
      />
      <Button type="submit" loading={verificationMutation.isPending}>
        Finish onboarding
      </Button>
    </form>
  );
}
