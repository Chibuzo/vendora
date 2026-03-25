'use client';

import { create } from 'zustand';

interface VendorDashboardState {
  selectedRange: '7d' | '30d';
  setSelectedRange: (selectedRange: '7d' | '30d') => void;
}

export const useVendorDashboardStore = create<VendorDashboardState>((set) => ({
  selectedRange: '30d',
  setSelectedRange: (selectedRange) => set({ selectedRange })
}));
