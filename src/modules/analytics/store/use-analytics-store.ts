'use client';

import { create } from 'zustand';

import type { AnalyticsSnapshot } from '@/modules/analytics/types';

interface AnalyticsState {
  snapshot: AnalyticsSnapshot | null;
  setSnapshot: (snapshot: AnalyticsSnapshot) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  snapshot: null,
  setSnapshot: (snapshot) => set({ snapshot })
}));
