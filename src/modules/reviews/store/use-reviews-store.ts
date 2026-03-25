'use client';

import { create } from 'zustand';

import type { ReviewSummary } from '@/modules/reviews/types';

interface ReviewsState {
  items: ReviewSummary[];
  setItems: (items: ReviewSummary[]) => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  items: [],
  setItems: (items) => set({ items })
}));
