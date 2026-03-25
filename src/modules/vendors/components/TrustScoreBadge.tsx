import { cn } from '@/lib/utils';
import { getTrustScoreTone } from '@/modules/vendors/services/vendor-service';

export function TrustScoreBadge({ score }: Readonly<{ score: number }>) {
  const tone = getTrustScoreTone(score);

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        tone === 'excellent' && 'bg-emerald-100 text-emerald-800',
        tone === 'strong' && 'bg-brand-100 text-brand-800',
        tone === 'watch' && 'bg-amber-100 text-amber-800'
      )}
    >
      Trust {score}
    </span>
  );
}
