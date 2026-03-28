import { Minus, Plus } from 'lucide-react';

import { PriceDisplay } from '@/shared/components/marketplace/price-display';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export interface CartItemCardProps {
  image: string;
  name: string;
  vendor: string;
  quantity: number;
  price: number;
  currency?: string;
  onDecrease?: () => void;
  onIncrease?: () => void;
}

export function CartItemCard({
  image,
  name,
  vendor,
  quantity,
  price,
  currency = 'NGN',
  onDecrease,
  onIncrease
}: CartItemCardProps) {
  return (
    <Card className="grid gap-4 p-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
      <div className="h-24 overflow-hidden rounded-[var(--radius-lg)] bg-neutral-100">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-1">
            <h3 className="font-medium text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{vendor}</p>
          </div>
          <PriceDisplay amount={price} currency={currency} />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon" aria-label="Decrease quantity" onClick={onDecrease}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-6 text-center text-sm font-medium text-foreground">{quantity}</span>
          <Button variant="secondary" size="icon" aria-label="Increase quantity" onClick={onIncrease}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
