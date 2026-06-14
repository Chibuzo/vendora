'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useVendorSetup } from '@/modules/marketplace';
import { useOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface VendorSetupFormValues {
  businessName: string;
  phone: string;
  description: string;
  category: string;
}

export function VendorSetupStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const businessName = useOnboardingStore((state) => state.businessName);
  const businessCategory = useOnboardingStore((state) => state.businessCategory);
  const completeVendorSetup = useOnboardingStore((state) => state.completeVendorSetup);
  const setupMutation = useVendorSetup();
  const form = useForm<VendorSetupFormValues>({
    defaultValues: {
      businessName,
      phone: '+2348012340001',
      description: '',
      category: businessCategory
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          await setupMutation.mutateAsync(values);
          completeVendorSetup({
            businessName: values.businessName,
            businessCategory: values.category
          });
          showToast({
            title: 'Storefront created',
            description: 'Next, add your operating location.',
            variant: 'success'
          });
          router.push(routes.onboarding.vendorLocation as Route);
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Set up your storefront</CardTitle>
        <CardDescription>Name the storefront and define the primary operating category for dashboard defaults.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Business name"
          placeholder="Beautiful Hair NG"
          error={form.formState.errors.businessName?.message}
          {...form.register('businessName', { required: 'Business name is required.' })}
        />
        <Input
          label="Phone"
          placeholder="+2348012345678"
          error={form.formState.errors.phone?.message}
          {...form.register('phone', { required: 'Phone number is required.' })}
        />
      </div>
      <Input
        label="Category"
        placeholder="Beauty"
        error={form.formState.errors.category?.message}
        {...form.register('category', { required: 'Category is required.' })}
      />
      <Textarea
        label="Business description"
        placeholder="Describe what buyers can expect from your storefront."
        error={form.formState.errors.description?.message}
        {...form.register('description', { required: 'A short description is required.' })}
      />
      <Button type="submit" loading={setupMutation.isPending}>
        Continue to location
      </Button>
    </form>
  );
}
