import { cn, formatCurrency } from '@/lib/utils';

export interface PriceDisplayProps {
  amount: number;
  currency?: string;
  originalAmount?: number;
  className?: string;
}

export function PriceDisplay({
  amount,
  currency = 'NGN',
  originalAmount,
  className
}: PriceDisplayProps) {
  const hasDiscount = typeof originalAmount === 'number' && originalAmount > amount;
  const discount = hasDiscount ? Math.round(((originalAmount - amount) / originalAmount) * 100) : null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-xl font-semibold text-foreground">{formatCurrency(amount, currency)}</span>
      {hasDiscount ? (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatCurrency(originalAmount, currency)}</span>
          <span className="rounded-full bg-success-100 px-2 py-1 text-xs font-semibold text-success-800">
            Save {discount}%
          </span>
        </>
      ) : null}
    </div>
  );
}
