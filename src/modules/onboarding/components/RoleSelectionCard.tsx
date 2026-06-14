'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';

interface RoleSelectionCardProps {
  title: string;
  description: string;
  badge: string;
  active: boolean;
  onClick: () => void;
}

export function RoleSelectionCard({ title, description, badge, active, onClick }: Readonly<RoleSelectionCardProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('text-left', active ? 'rounded-[var(--radius-2xl)] ring-4 ring-ring/30' : '')}
    >
      <Card hover className={cn(active ? 'border-primary-300 bg-primary-50' : '')}>
        <CardHeader>
          <Badge variant={active ? 'primary' : 'secondary'}>{badge}</Badge>
          <CardTitle className="mt-3 text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
}
