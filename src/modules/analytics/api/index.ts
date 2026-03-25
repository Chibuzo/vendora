import { apiClient } from '@/lib/api-client';

import type { AnalyticsSnapshot } from '@/modules/analytics/types';

export async function getAnalyticsSnapshot() {
  const response = await apiClient.get<AnalyticsSnapshot>('/analytics');
  return response.data;
}
