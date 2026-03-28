import { PackageCheck, Truck } from 'lucide-react';

import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';

export interface OrderCardProps {
  orderNumber: string;
  status: 'processing' | 'fulfilled' | 'in-transit' | 'cancelled';
  items: string[];
  totalAmount: number;
  currency?: string;
}

const statusStyles: Record<OrderCardProps['status'], { label: string; badge: React.ComponentProps<typeof Badge>['variant'] }> = {
  processing: { label: 'Processing', badge: 'info' },
  fulfilled: { label: 'Fulfilled', badge: 'success' },
  'in-transit': { label: 'In transit', badge: 'warning' },
  cancelled: { label: 'Cancelled', badge: 'danger' }
};

export function OrderCard({
  orderNumber,
  status,
  items,
  totalAmount,
  currency = 'NGN'
}: OrderCardProps) {
  const style = statusStyles[status];

  return (
    <Card className="grid gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">Order {orderNumber}</p>
          <p className="font-medium text-foreground">{items.length} items</p>
        </div>
        <Badge variant={style.badge}>{style.label}</Badge>
      </div>
      <div className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <PackageCheck className="h-4 w-4" />
            {item}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-[var(--radius-xl)] bg-neutral-100 px-4 py-3">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className={cn('h-4 w-4', status === 'in-transit' ? 'text-warning-700' : 'text-primary-700')} />
          {status === 'in-transit' ? 'Delivery in progress' : 'Status updated'}
        </div>
        <span className="font-semibold text-foreground">{formatCurrency(totalAmount, currency)}</span>
      </div>
    </Card>
  );
}
