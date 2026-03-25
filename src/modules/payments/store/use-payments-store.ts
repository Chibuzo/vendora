'use client';

import { create } from 'zustand';

import type { PaymentMethod } from '@/modules/payments/types';

interface PaymentsState {
  methods: PaymentMethod[];
  setMethods: (methods: PaymentMethod[]) => void;
}

export const usePaymentsStore = create<PaymentsState>((set) => ({
  methods: [],
  setMethods: (methods) => set({ methods })
}));
