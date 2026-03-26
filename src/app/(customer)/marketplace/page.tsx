import { getProductsServer } from '@/modules/products/api/get-products-server';
import { ProductCard, ProductsGridClient } from '@/modules/products';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default async function MarketplacePage() {
  const featured = await getProductsServer({
    sortBy: 'featured',
    limit: 3
  });

  return (
    <div className="space-y-10">
      <Card variant="elevated">
        <CardHeader>
          <Badge variant="secondary" size="sm">
            Live catalog
          </Badge>
          <CardTitle className="mt-3">React Query powers the interactive product feed.</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-6 text-muted-foreground">
          Search, sort, and card states now share the same design tokens as the dashboard shells.
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-3">
        {featured.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-primary-700">Live catalog</p>
          <h2 className="font-display text-3xl font-semibold text-foreground">
            React Query handles the interactive product feed.
          </h2>
        </div>
        <ProductsGridClient initialProducts={featured.items} />
      </section>
    </div>
  );
}
