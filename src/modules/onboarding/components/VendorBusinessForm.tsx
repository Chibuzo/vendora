'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateVendor } from '@/modules/onboarding/hooks/use-vendor-onboarding-api';
import { useOnboardingStore, useVendorOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

const categories = [
  'Hair & Wigs',
  'Fashion',
  'Jewelry',
  'Food',
  'Perfume',
  'Home Items',
  'Beauty',
  'Electronics',
  'Other'
].map((category) => ({ label: category, value: category }));

const businessSchema = z.object({
  businessName: z.string().trim().min(1, 'Business name is required.'),
  category: z.string().trim().min(1, 'Category is required.'),
  phone: z.string().trim().min(1, 'Business phone or WhatsApp number is required.'),
  description: z.string().trim().optional()
});

type VendorBusinessFormValues = z.infer<typeof businessSchema>;

export function VendorBusinessForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const createVendorMutation = useCreateVendor();
  const businessName = useVendorOnboardingStore((state) => state.businessName);
  const businessCategory = useVendorOnboardingStore((state) => state.businessCategory);
  const phone = useVendorOnboardingStore((state) => state.phone);
  const description = useVendorOnboardingStore((state) => state.description);
  const saveBusinessDraft = useVendorOnboardingStore((state) => state.saveBusinessDraft);
  const completeBusinessProfile = useVendorOnboardingStore((state) => state.completeBusinessProfile);
  const completeVendorSetup = useOnboardingStore((state) => state.completeVendorSetup);
  const form = useForm<VendorBusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName,
      category: businessCategory,
      phone,
      description
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          try {
            const normalizedValues = {
              ...values,
              description: values.description ?? ''
            };
            saveBusinessDraft(normalizedValues);
            const vendor = await createVendorMutation.mutateAsync({
              ...normalizedValues
            });
            completeBusinessProfile({
              ...normalizedValues,
              vendorId: vendor.id
            });
            completeVendorSetup({
              businessName: normalizedValues.businessName,
              businessCategory: normalizedValues.category
            });
            showToast({
              title: 'Business profile saved',
              description: 'Add your operating location so buyers can find you.',
              variant: 'success'
            });
            router.push(routes.onboarding.vendorLocation as Route);
          } catch (error) {
            showToast({
              title: 'Business profile not saved',
              description: error instanceof Error ? error.message : 'Check the details and try again.',
              variant: 'danger'
            });
          }
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Business profile</CardTitle>
        <CardDescription>Capture the essentials buyers need to recognize and contact your store.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Business name"
          placeholder="Beautiful Hair NG"
          error={form.formState.errors.businessName?.message}
          {...form.register('businessName')}
        />
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <Select
              label="Business category"
              placeholder="Choose a category"
              options={categories}
              value={field.value}
              onValueChange={field.onChange}
              error={form.formState.errors.category?.message}
            />
          )}
        />
      </div>
      <Input
        label="Business phone / WhatsApp number"
        placeholder="+2348012345678"
        error={form.formState.errors.phone?.message}
        {...form.register('phone')}
      />
      <Textarea
        label="Short description"
        placeholder="Tell buyers what you sell, where you deliver, or what makes your store useful."
        error={form.formState.errors.description?.message}
        {...form.register('description')}
      />
      <Button type="submit" loading={createVendorMutation.isPending}>
        Save and continue
      </Button>
    </form>
  );
}
