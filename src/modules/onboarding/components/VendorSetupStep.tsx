'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

interface VendorSetupFormValues {
  businessName: string;
  businessCategory: string;
}

export function VendorSetupStep() {
  const router = useRouter();
  const businessName = useOnboardingStore((state) => state.businessName);
  const businessCategory = useOnboardingStore((state) => state.businessCategory);
  const completeVendorSetup = useOnboardingStore((state) => state.completeVendorSetup);
  const form = useForm<VendorSetupFormValues>({
    defaultValues: {
      businessName,
      businessCategory
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        completeVendorSetup(values);
        router.push(routes.onboarding.vendorLocation as Route);
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Set up your storefront</CardTitle>
        <CardDescription>Name the storefront and define the primary operating category for dashboard defaults.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Business name"
          placeholder="GreenGrid Supplies"
          error={form.formState.errors.businessName?.message}
          {...form.register('businessName', { required: 'Business name is required.' })}
        />
        <Input
          label="Category"
          placeholder="Energy systems"
          error={form.formState.errors.businessCategory?.message}
          {...form.register('businessCategory', { required: 'Category is required.' })}
        />
      </div>
      <Button type="submit">Continue to location</Button>
    </form>
  );
}
