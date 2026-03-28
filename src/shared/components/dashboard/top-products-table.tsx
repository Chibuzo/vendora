import { formatCurrency } from '@/lib/utils';
import { TrustBadge } from '@/shared/components/marketplace/trust-badge';
import { Card } from '@/shared/components/ui/card';

export interface TopProductsTableItem {
  name: string;
  unitsSold: number;
  revenue: number;
  trustStatus: 'verified' | 'high-trust' | 'new' | 'flagged';
}

export interface TopProductsTableProps {
  items: TopProductsTableItem[];
}

export function TopProductsTable({ items }: TopProductsTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border/70 px-5 py-4">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">Top products</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-100 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Units</th>
              <th className="px-5 py-3 font-medium">Revenue</th>
              <th className="px-5 py-3 font-medium">Trust</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="border-t border-border/60">
                <td className="px-5 py-4 font-medium text-foreground">{item.name}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.unitsSold}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{formatCurrency(item.revenue)}</td>
                <td className="px-5 py-4">
                  <TrustBadge status={item.trustStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
