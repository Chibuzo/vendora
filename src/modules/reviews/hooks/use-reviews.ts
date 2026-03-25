'use client';

import { useReviewsStore } from '@/modules/reviews/store/use-reviews-store';

export function useReviews() {
  return useReviewsStore();
}
