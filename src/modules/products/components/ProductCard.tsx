import { ProductCard as MarketplaceProductCard } from '@/shared/components/marketplace/product-card';

import type { Product } from '@/modules/products/types';

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <MarketplaceProductCard
      image={product.imageUrl}
      name={product.name}
      price={product.price}
      currency={product.currency}
      vendor={product.vendorName}
      rating={Math.min(5, Math.max(3.8, product.trustScore / 20))}
      reviewCount={Math.round(product.trustScore * 1.7)}
      trustStatus={product.trustScore >= 92 ? 'verified' : product.trustScore >= 86 ? 'high-trust' : 'new'}
      description={product.description}
      category={product.category}
    />
  );
}
