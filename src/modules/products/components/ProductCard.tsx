import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

import type { Product } from '@/modules/products/types';

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <Card hover className="overflow-hidden p-0">
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
              {product.category}
            </p>
            <Badge variant="primary">Trust {product.trustScore}</Badge>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.vendorName}</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(product.price, product.currency)}</p>
          </div>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
