'use client';

import type { Route } from 'next';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateVendorProduct, useVendorProducts } from '@/modules/marketplace';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { useToast } from '@/shared/components/feedback/toast';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
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

export default function EditVendorProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading } = useVendorProducts();
  const updateProduct = useUpdateVendorProduct();
  const product = data?.find((entry) => entry.id === params.id);
  const form = useForm<ProductFormValues>();

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        price: String(product.price),
        stockQuantity: String(product.stockQuantity),
        description: product.description
      });
    }
  }, [form, product]);

  if (isLoading) {
    return <GroupLoading />;
  }

  if (!product) {
    return <EmptyState title="Product not found" description="The requested inventory item could not be located." />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Edit product"
        title={`Update ${product.name}`}
        description="Adjust pricing, stock, category, or description without leaving the vendor console."
      />
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Product configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit((values) => {
              void (async () => {
                await updateProduct.mutateAsync({
                  id: product.id,
                  name: values.name,
                  description: values.description,
                  category: values.category,
                  price: Number(values.price),
                  stockQuantity: Number(values.stockQuantity)
                });
                showToast({
                  title: 'Product updated',
                  description: 'Inventory changes are live.',
                  variant: 'success'
                });
                router.push(routes.vendor.products as Route);
              })();
            })}
          >
            <Input label="Product name" {...form.register('name', { required: true })} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Category" {...form.register('category', { required: true })} />
              <Input label="Price" {...form.register('price', { required: true })} />
            </div>
            <Input label="Stock quantity" {...form.register('stockQuantity', { required: true })} />
            <Textarea label="Description" {...form.register('description', { required: true })} />
            <Button type="submit" loading={updateProduct.isPending}>
              Update product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
