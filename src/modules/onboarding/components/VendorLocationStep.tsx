'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

interface VendorLocationFormValues {
  city: string;
  region: string;
}

export function VendorLocationStep() {
  const router = useRouter();
  const city = useOnboardingStore((state) => state.city);
  const region = useOnboardingStore((state) => state.region);
  const completeLocation = useOnboardingStore((state) => state.completeLocation);
  const form = useForm<VendorLocationFormValues>({
    defaultValues: {
      city,
      region
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        completeLocation(values);
        router.push(routes.onboarding.vendorVerification as Route);
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Configure operating location</CardTitle>
        <CardDescription>Use location data for delivery estimates, trust badges, and regional search filters.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="City"
          placeholder="Lagos"
          error={form.formState.errors.city?.message}
          {...form.register('city', { required: 'City is required.' })}
        />
        <Input
          label="State / Region"
          placeholder="Lagos State"
          error={form.formState.errors.region?.message}
          {...form.register('region', { required: 'Region is required.' })}
        />
      </div>
      <Button type="submit">Continue to verification</Button>
    </form>
  );
}
