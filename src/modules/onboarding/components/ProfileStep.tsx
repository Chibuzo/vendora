'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

interface ProfileFormValues {
  fullName: string;
}

export function ProfileStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const { completeSignup, isCompleteSignupPending } = useAuth();
  const fullName = useOnboardingStore((state) => state.fullName);
  const completeProfile = useOnboardingStore((state) => state.completeProfile);
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          await completeSignup({
            fullName: values.fullName
          });
          completeProfile(values);
          showToast({
            title: 'Profile saved',
            description: 'Your account details are ready for role selection.',
            variant: 'success'
          });
          router.push(routes.onboarding.role as Route);
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Set up your account profile</CardTitle>
        <CardDescription>Capture the identity details used across buyer, vendor, and shared workspace screens.</CardDescription>
      </CardHeader>
      <Input
        label="Full name"
        placeholder="Amina Balogun"
        error={form.formState.errors.fullName?.message}
        {...form.register('fullName', { required: 'Your name is required.' })}
      />
      <Button type="submit" loading={isCompleteSignupPending}>
        Continue to role selection
      </Button>
    </form>
  );
}
