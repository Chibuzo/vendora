import { apiClient } from '@/lib/api-client';

import type { ReviewSummary } from '@/modules/reviews/types';

export async function getReviews() {
  const response = await apiClient.get<ReviewSummary[]>('/reviews');
  return response.data;
}
