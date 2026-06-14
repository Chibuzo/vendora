'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useCreateVendorProduct } from '@/modules/marketplace';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { useToast } from '@/shared/components/feedback/toast';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { routes } from '@/shared/constants/routes';

interface ProductFormValues {
  name: string;
  category: string;
  price: string;
  stockQuantity: string;
  description: string;
}

export default function NewVendorProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createProduct = useCreateVendorProduct();
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      category: '',
      price: '',
      stockQuantity: '1',
      description: ''
    }
  });

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="New product"
        title="Create inventory without leaving the vendor shell."
        description="New products become available in the public catalog as soon as they are saved."
      />
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit((values) => {
              void (async () => {
                await createProduct.mutateAsync({
                  name: values.name,
                  description: values.description,
                  category: values.category,
                  price: Number(values.price),
                  stockQuantity: Number(values.stockQuantity)
                });
                showToast({
                  title: 'Product created',
                  description: 'The new product is now available in your inventory.',
                  variant: 'success'
                });
                router.push(routes.vendor.products as Route);
              })();
            })}
          >
            <Input label="Product name" placeholder="Raw Vietnamese Hair Bundle" {...form.register('name', { required: true })} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Category" placeholder="Beauty" {...form.register('category', { required: true })} />
              <Input label="Price" placeholder="85000" {...form.register('price', { required: true })} />
            </div>
            <Input label="Stock quantity" placeholder="24" {...form.register('stockQuantity', { required: true })} />
            <Textarea label="Description" placeholder="Double-drawn bundle with same-day pickup in Ikeja." {...form.register('description', { required: true })} />
            <Button type="submit" loading={createProduct.isPending}>
              Save product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
