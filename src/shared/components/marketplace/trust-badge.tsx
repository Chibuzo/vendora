import * as React from 'react';
import { AlertTriangle, BadgeCheck, ShieldCheck, TimerReset } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';

export type TrustBadgeVariant = 'verified' | 'high-trust' | 'new' | 'flagged';

const trustConfig: Record<
  TrustBadgeVariant,
  { label: string; icon: React.ElementType; variant: 'success' | 'primary' | 'info' | 'danger' }
> = {
  verified: { label: 'Verified', icon: BadgeCheck, variant: 'success' },
  'high-trust': { label: 'High trust', icon: ShieldCheck, variant: 'primary' },
  new: { label: 'New vendor', icon: TimerReset, variant: 'info' },
  flagged: { label: 'Flagged', icon: AlertTriangle, variant: 'danger' }
};

export interface TrustBadgeProps extends React.ComponentPropsWithoutRef<typeof Badge> {
  status: TrustBadgeVariant;
}

export function TrustBadge({ status, children, ...props }: TrustBadgeProps) {
  const config = trustConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} {...props}>
      <Icon className="h-3.5 w-3.5" />
      {children || config.label}
    </Badge>
  );
}
