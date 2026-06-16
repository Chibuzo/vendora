'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useUpdateVendorStorefront } from '@/modules/onboarding/hooks/use-vendor-onboarding-api';
import { useOnboardingStore, useVendorOnboardingStore } from '@/modules/onboarding/store/use-onboarding-store';
import { routes } from '@/shared/constants/routes';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^https?:\/\//i.test(value), 'Enter a full URL starting with http:// or https://.');

const storefrontSchema = z.object({
  logoUrl: optionalUrl,
  bannerUrl: optionalUrl,
  instagramUrl: optionalUrl,
  whatsappUrl: optionalUrl
});

type VendorStorefrontFormValues = z.infer<typeof storefrontSchema>;

function nullable(value?: string) {
  const trimmed = value?.trim() ?? '';
  return trimmed ? trimmed : null;
}

export function VendorStorefrontForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const logoUrl = useVendorOnboardingStore((state) => state.logoUrl);
  const bannerUrl = useVendorOnboardingStore((state) => state.bannerUrl);
  const instagramUrl = useVendorOnboardingStore((state) => state.instagramUrl);
  const whatsappUrl = useVendorOnboardingStore((state) => state.whatsappUrl);
  const saveStorefrontDraft = useVendorOnboardingStore((state) => state.saveStorefrontDraft);
  const completeStorefront = useVendorOnboardingStore((state) => state.completeStorefront);
  const markStorefrontComplete = useOnboardingStore((state) => state.markStorefrontComplete);
  const storefrontMutation = useUpdateVendorStorefront();
  const form = useForm<VendorStorefrontFormValues>({
    resolver: zodResolver(storefrontSchema),
    defaultValues: {
      logoUrl,
      bannerUrl,
      instagramUrl,
      whatsappUrl
    }
  });

  const goToFirstProduct = () => {
    router.push(routes.onboarding.vendorFirstProduct as Route);
  };

  const skip = () => {
    completeStorefront({});
    markStorefrontComplete();
    showToast({
      title: 'Storefront media skipped',
      description: 'You can add public storefront details from settings later.',
      variant: 'info'
    });
    goToFirstProduct();
  };

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => {
        void (async () => {
          try {
            saveStorefrontDraft({
              logoUrl: values.logoUrl ?? '',
              bannerUrl: values.bannerUrl ?? '',
              instagramUrl: values.instagramUrl ?? '',
              whatsappUrl: values.whatsappUrl ?? ''
            });
            await storefrontMutation.mutateAsync({
              logoUrl: nullable(values.logoUrl),
              bannerUrl: nullable(values.bannerUrl),
              instagramUrl: nullable(values.instagramUrl)
            });
            completeStorefront({
              logoUrl: values.logoUrl ?? '',
              bannerUrl: values.bannerUrl ?? '',
              instagramUrl: values.instagramUrl ?? '',
              whatsappUrl: values.whatsappUrl ?? ''
            });
            markStorefrontComplete();
            showToast({
              title: 'Storefront details saved',
              description: 'Add a first product so buyers have something to view.',
              variant: 'success'
            });
            goToFirstProduct();
          } catch (error) {
            showToast({
              title: 'Storefront not saved',
              description: error instanceof Error ? error.message : 'Check the links and try again.',
              variant: 'danger'
            });
          }
        })();
      })}
    >
      <CardHeader className="p-0">
        <CardTitle>Storefront setup</CardTitle>
        <CardDescription>This is optional for now. Add public media and social links if you already have them.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Store logo URL"
          placeholder="https://..."
          error={form.formState.errors.logoUrl?.message}
          {...form.register('logoUrl')}
        />
        <Input
          label="Banner image URL"
          placeholder="https://..."
          error={form.formState.errors.bannerUrl?.message}
          {...form.register('bannerUrl')}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Instagram link"
          placeholder="https://instagram.com/yourstore"
          error={form.formState.errors.instagramUrl?.message}
          {...form.register('instagramUrl')}
        />
        <Input
          label="WhatsApp link"
          placeholder="https://wa.me/2348012345678"
          error={form.formState.errors.whatsappUrl?.message}
          {...form.register('whatsappUrl')}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" loading={storefrontMutation.isPending}>
          Save and continue
        </Button>
        <Button type="button" variant="outline" onClick={skip}>
          Skip for now
        </Button>
      </div>
    </form>
  );
}
