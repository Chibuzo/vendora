'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useCreateVendorLocation } from '@/modules/onboarding/hooks/use-vendor-onboarding-api';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

interface VendorLocationFormValues {
  state: string;
  city: string;
  address: string;
}

export function VendorLocationStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const city = useOnboardingStore((state) => state.city);
  const region = useOnboardingStore((state) => state.region);
  const completeLocation = useOnboardingStore((state) => state.completeLocation);
  const locationMutation = useCreateVendorLocation();
  const form = useForm<VendorLocationFormValues>({
    defaultValues: {
      state: region,
      city,
      address: ''
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          try {
            await locationMutation.mutateAsync({
              state: values.state,
              city: values.city,
              address: values.address
            });
            completeLocation({
              city: values.city,
              region: values.state
            });
            showToast({
              title: 'Location saved',
              description: 'Your storefront is ready for verification.',
              variant: 'success'
            });
            router.push(routes.onboarding.vendorStorefront as Route);
          } catch (error) {
            showToast({
              title: 'Location not saved',
              description: error instanceof Error ? error.message : 'Check the details and try again.',
              variant: 'danger'
            });
          }
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Configure operating location</CardTitle>
        <CardDescription>Use location data for delivery estimates, trust badges, and regional search filters.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="State"
          placeholder="Lagos"
          error={form.formState.errors.state?.message}
          {...form.register('state', { required: 'State is required.' })}
        />
        <Input
          label="City"
          placeholder="Lagos"
          error={form.formState.errors.city?.message}
          {...form.register('city', { required: 'City is required.' })}
        />
      </div>
      <Input
        label="Address"
        placeholder="12 Allen Avenue, Ikeja"
        error={form.formState.errors.address?.message}
        {...form.register('address', { required: 'Business address is required.' })}
      />
      <Button type="submit" loading={locationMutation.isPending}>
        Continue to storefront setup
      </Button>
    </form>
  );
}
