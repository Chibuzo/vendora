'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface VerificationFormValues {
  verificationNotes: string;
}

export function VendorVerificationStep() {
  const router = useRouter();
  const verificationNotes = useOnboardingStore((state) => state.verificationNotes);
  const submitVerification = useOnboardingStore((state) => state.submitVerification);
  const form = useForm<VerificationFormValues>({
    defaultValues: {
      verificationNotes
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        submitVerification(values);
        router.push(routes.vendor.dashboard as Route);
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Submit verification package</CardTitle>
        <CardDescription>Capture the final seller context needed before opening the vendor dashboard.</CardDescription>
      </CardHeader>
      <Input label="Verification status" value="Documents ready for submission" disabled />
      <Textarea
        label="Notes for review team"
        placeholder="Registered business, active payout account, and warehouse location confirmed."
        error={form.formState.errors.verificationNotes?.message}
        {...form.register('verificationNotes', { required: 'Verification notes are required.' })}
      />
      <Button type="submit">Finish onboarding</Button>
    </form>
  );
}
