'use client';

import { create } from 'zustand';

import type { FraudReport } from '@/modules/trust/types';

interface TrustState {
  reports: FraudReport[];
  setReports: (reports: FraudReport[]) => void;
}

export const useTrustStore = create<TrustState>((set) => ({
  reports: [],
  setReports: (reports) => set({ reports })
}));
