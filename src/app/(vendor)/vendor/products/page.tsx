import type { Route } from 'next';
import Link from 'next/link';

import { mockProducts } from '@/shared/constants/mock-data';
import { routes } from '@/shared/constants/routes';
import { ProductCard } from '@/modules/products/components/ProductCard';
import { SectionIntro } from '@/shared/components/layout/section-intro';
import { buttonVariants } from '@/shared/components/ui/button';

export default function VendorProductsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Products"
        title="Manage vendor inventory"
        description="Vendor inventory tooling lives at `/vendor/products`, separate from public catalog browsing."
        actions={
          <Link href={routes.vendor.newProduct as Route} className={buttonVariants({ variant: 'primary' })}>
            Add product
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {mockProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="space-y-3">
            <ProductCard product={product} />
            <Link href={routes.vendor.editProduct(product.id) as Route} className={buttonVariants({ variant: 'outline' })}>
              Edit product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
