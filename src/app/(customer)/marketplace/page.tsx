import { getProductsServer } from '@/modules/products/api/get-products-server';
import { ProductCard, ProductsGridClient } from '@/modules/products';

export default async function MarketplacePage() {
  const featured = await getProductsServer({
    sortBy: 'featured',
    limit: 3
  });

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-3">
        {featured.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Live catalog</p>
          <h2 className="font-display text-3xl font-semibold text-ink">
            React Query handles the interactive product feed.
          </h2>
        </div>
        <ProductsGridClient initialProducts={featured.items} />
      </section>
    </div>
  );
}
