import { getTrustScoreTone } from '@/modules/vendors/services/vendor-service';
import { Badge } from '@/shared/components/ui/badge';

export function TrustScoreBadge({ score }: Readonly<{ score: number }>) {
  const tone = getTrustScoreTone(score);

  return (
    <Badge
      variant={tone === 'excellent' ? 'success' : tone === 'strong' ? 'primary' : 'warning'}
    >
      Trust {score}
    </Badge>
  );
}
