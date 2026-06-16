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
import { Select } from '@/shared/components/ui/select';
import { useStates, useCities } from '@/modules/onboarding/hooks/use-vendor-onboarding-api';

interface VendorLocationFormValues {
  stateId: string;
  cityId: string;
  address: string;
}

export function VendorLocationStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const city = useOnboardingStore((state) => state.city);
  const region = useOnboardingStore((state) => state.region);
  const completeLocation = useOnboardingStore((state) => state.completeLocation);
  const locationMutation = useCreateVendorLocation();

  const { data: states = [], isLoading: isLoadingStates } = useStates();

  const form = useForm<VendorLocationFormValues>({
    defaultValues: {
      stateId: '',
      cityId: '',
      address: ''
    }
  });

  const selectedStateId = form.watch('stateId');
  const { data: cities = [], isLoading: isLoadingCities } = useCities(
    selectedStateId ? Number(selectedStateId) : null
  );

  // Register the fields manually to apply validation rules
  form.register('stateId', { required: 'State is required.' });
  form.register('cityId', { required: 'City is required.' });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          try {
            await locationMutation.mutateAsync({
              stateId: Number(values.stateId),
              cityId: Number(values.cityId),
              address: values.address
            });
            completeLocation({
              city: cities.find((c) => c.id === Number(values.cityId))?.name || '',
              region: states.find((s) => s.id === Number(values.stateId))?.name || ''
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
        <Select
          label="State"
          placeholder={isLoadingStates ? "Loading..." : "Select state"}
          options={Array.isArray(states) ? states.map(state => ({ label: state.name, value: String(state.id) })) : []}
          value={form.watch('stateId')}
          onValueChange={(val) => {
            form.setValue('stateId', val);
            form.setValue('cityId', ''); // Reset city when state changes
          }}
          error={form.formState.errors.stateId?.message}
          disabled={isLoadingStates}
        />
        <Select
          label="City"
          placeholder={isLoadingCities ? "Loading..." : "Select city"}
          options={Array.isArray(cities) ? cities.map(city => ({ label: city.name, value: String(city.id) })) : []}
          value={form.watch('cityId')}
          onValueChange={(val) => form.setValue('cityId', val)}
          error={form.formState.errors.cityId?.message}
          disabled={!selectedStateId || isLoadingCities}
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
