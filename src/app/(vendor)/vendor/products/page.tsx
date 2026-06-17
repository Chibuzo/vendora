'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { useDeleteProduct, useCurrentVendorProducts } from '@/lib/api/hooks/useProducts';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { buttonVariants, Button } from '@/shared/components/ui/button';
import { routes } from '@/shared/constants/routes';

export default function VendorProductsPage() {
  const { data: rawData, isLoading } = useCurrentVendorProducts();
  const deleteProduct = useDeleteProduct();
  
  // The backend returns an array directly at runtime, even though OpenAPI spec differs
  const products = Array.isArray(rawData) ? rawData : (rawData as any)?.items ?? [];

  if (isLoading) {
    return <GroupLoading />;
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Products"
        title="Manage vendor inventory"
        description="Create, edit, or remove products without leaving the vendor dashboard."
        actions={
          <Link href={routes.vendor.newProduct as Route} className={buttonVariants({ variant: 'primary' })}>
            Add product
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {products.map((product: any) => (
          <div key={product.id} className="space-y-3">
            <ProductCard
              image={product.images?.[0]?.url || product.imageUrls?.[0] || ''}
              name={product.name}
              price={product.price}
              currency="NGN"
              vendor={product.vendor?.businessName || 'Your Store'}
              rating={product.metric?.averageRating || 0}
              reviewCount={product.metric?.reviewCount || 0}
              trustStatus={(product.vendor?.trustScore || 0) >= 92 ? 'verified' : 'high-trust'}
              description={product.description || ''}
              category={product.category?.name || 'Uncategorized'}
            />
            <div className="flex gap-3">
              <Link href={routes.vendor.editProduct(product.id) as Route} className={buttonVariants({ variant: 'outline' })}>
                Edit product
              </Link>
              <Button variant="danger" onClick={() => void deleteProduct.mutateAsync(product.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
