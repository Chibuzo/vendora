import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/shared/components/ui/Card';

import type { Product } from '@/modules/products/types';

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              {product.category}
            </p>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
              Trust {product.trustScore}
            </span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{product.vendorName}</p>
            <p className="text-xl font-semibold text-ink">{formatCurrency(product.price, product.currency)}</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            View
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
