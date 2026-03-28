import { Badge } from '@/shared/components/ui/badge';

export interface VerificationStatusBadgeProps {
  status: 'pending' | 'verified' | 'rejected' | 'needs-review';
}

const copy = {
  pending: { label: 'Pending review', variant: 'warning' },
  verified: { label: 'Verified', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  'needs-review': { label: 'Needs review', variant: 'info' }
} as const;

export function VerificationStatusBadge({ status }: VerificationStatusBadgeProps) {
  const config = copy[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
