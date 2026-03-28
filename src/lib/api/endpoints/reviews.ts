import type { Review, ReviewResponse } from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type { CreateReviewInput } from '../types';

export function createReview(data: CreateReviewInput) {
  return apiClient.post<ReviewResponse, CreateReviewInput, Review>('/reviews', data);
}
