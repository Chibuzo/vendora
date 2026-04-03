'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { useDeleteVendorProduct, useVendorProducts } from '@/modules/marketplace';
import { GroupLoading } from '@/shared/components/feedback/group-loading';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { buttonVariants, Button } from '@/shared/components/ui/button';
import { routes } from '@/shared/constants/routes';

export default function VendorProductsPage() {
  const { data, isLoading } = useVendorProducts();
  const deleteProduct = useDeleteVendorProduct();

  if (isLoading || !data) {
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
        {data.map((product) => (
          <div key={product.id} className="space-y-3">
            <ProductCard
              image={product.imageUrl}
              name={product.name}
              price={product.price}
              currency={product.currency}
              vendor={product.vendorName}
              rating={product.rating}
              reviewCount={product.reviewCount}
              trustStatus={product.trustScore >= 92 ? 'verified' : 'high-trust'}
              description={product.description}
              category={product.category}
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
