'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  useCompleteVendorOnboarding,
  useCreateVendorProduct
} from '@/modules/onboarding/hooks/use-vendor-onboarding-api';
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

const firstProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required.'),
  category: z.string().trim().min(1, 'Category is required.'),
  price: z
    .string()
    .trim()
    .refine((value) => Number(value) > 0, 'Price must be greater than 0.'),
  imageUrl: z.string().trim().min(1, 'Product image URL is required.'),
  stockQuantity: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number(value) >= 0, 'Stock quantity cannot be negative.'),
  description: z.string().trim().optional()
});

type FirstProductFormValues = z.infer<typeof firstProductSchema>;

export function FirstProductForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const vendorId = useVendorOnboardingStore((state) => state.vendorId);
  const name = useVendorOnboardingStore((state) => state.firstProductName);
  const category = useVendorOnboardingStore((state) => state.firstProductCategory || state.businessCategory);
  const price = useVendorOnboardingStore((state) => state.firstProductPrice);
  const imageUrl = useVendorOnboardingStore((state) => state.firstProductImageUrl);
  const stockQuantity = useVendorOnboardingStore((state) => state.firstProductStockQuantity);
  const description = useVendorOnboardingStore((state) => state.firstProductDescription);
  const saveFirstProductDraft = useVendorOnboardingStore((state) => state.saveFirstProductDraft);
  const completeFirstProduct = useVendorOnboardingStore((state) => state.completeFirstProduct);
  const completeOnboarding = useVendorOnboardingStore((state) => state.completeOnboarding);
  const createProductMutation = useCreateVendorProduct();
  const markFirstProductComplete = useOnboardingStore((state) => state.markFirstProductComplete);
  const completeOnboardingMutation = useCompleteVendorOnboarding();
  const priceValue = price > 0 ? String(price) : '';
  const stockQuantityValue = stockQuantity > 0 ? String(stockQuantity) : '';
  const form = useForm<FirstProductFormValues>({
    resolver: zodResolver(firstProductSchema),
    defaultValues: {
      name,
      category,
      price: priceValue,
      imageUrl,
      stockQuantity: stockQuantityValue,
      description
    }
  });

  const finishOnboarding = async () => {
    await completeOnboardingMutation.mutateAsync({
      onboardingCompleted: true
    });
    markFirstProductComplete();
    completeOnboarding();
    router.push(routes.vendor.dashboard as Route);
  };

  const skip = () => {
    void (async () => {
      try {
        completeFirstProduct({});
        await finishOnboarding();
        showToast({
          title: 'Onboarding complete',
          description: 'Your dashboard is ready. Add a product when you are ready to publish your store.',
          variant: 'success'
        });
      } catch (error) {
        showToast({
          title: 'Could not finish onboarding',
          description: error instanceof Error ? error.message : 'Try again in a moment.',
          variant: 'danger'
        });
      }
    })();
  };

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          try {
            const productDraft = {
              firstProductName: values.name,
              firstProductCategory: values.category,
              firstProductPrice: Number(values.price),
              firstProductImageUrl: values.imageUrl,
              firstProductStockQuantity: values.stockQuantity ? Number(values.stockQuantity) : 0,
              firstProductDescription: values.description ?? ''
            };

            saveFirstProductDraft(productDraft);
            await createProductMutation.mutateAsync({
              name: values.name,
              category: values.category,
              price: Number(values.price),
              imageUrl: values.imageUrl,
              stockQuantity: values.stockQuantity ? Number(values.stockQuantity) : 0,
              description: values.description ?? ''
            });
            completeFirstProduct(productDraft);
            await finishOnboarding();
            showToast({
              title: 'Product added',
              description: 'Your store is live. Verification can be completed from the dashboard.',
              variant: 'success'
            });
          } catch (error) {
            showToast({
              title: 'Product not added',
              description: error instanceof Error ? error.message : 'Check the details and try again.',
              variant: 'danger'
            });
          }
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Add your first product</CardTitle>
        <CardDescription>A storefront is more useful when buyers can inspect at least one item right away.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Product name"
          placeholder="Bone straight wig"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Choose a category"
              options={categories}
              value={field.value}
              onValueChange={field.onChange}
              error={form.formState.errors.category?.message}
            />
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Price"
          type="number"
          min="0"
          step="100"
          placeholder="45000"
          error={form.formState.errors.price?.message}
          {...form.register('price')}
        />
        <Input
          label="Stock quantity"
          type="number"
          min="0"
          placeholder="10"
          error={form.formState.errors.stockQuantity?.message}
          {...form.register('stockQuantity')}
        />
      </div>
      <Input
        label="Product image URL"
        placeholder="https://..."
        error={form.formState.errors.imageUrl?.message}
        {...form.register('imageUrl')}
      />
      <Textarea
        label="Description"
        placeholder="Describe the item, delivery options, and what buyers should know."
        error={form.formState.errors.description?.message}
        {...form.register('description')}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" loading={createProductMutation.isPending || completeOnboardingMutation.isPending}>
          Add product and finish
        </Button>
        <Button
          type="button"
          variant="outline"
          loading={completeOnboardingMutation.isPending}
          onClick={skip}
        >
          Skip and go to dashboard
        </Button>
      </div>
    </form>
  );
}
