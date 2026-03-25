'use client';

import { useAnalyticsStore } from '@/modules/analytics/store/use-analytics-store';

export function useAnalytics() {
  return useAnalyticsStore();
}
