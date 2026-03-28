import { mockProducts } from '@/shared/constants/mock-data';
import { ProductCard } from '@/modules/products/components/ProductCard';
import { SectionIntro } from '@/shared/components/layout/section-intro';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Product listing"
        title="Searchable public catalog"
        description="The public `/products` route remains separate from vendor inventory management at `/vendor/products`."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
