'use client';

import { create } from 'zustand';

import type { OrderSummary } from '@/modules/orders/types';

interface OrdersState {
  items: OrderSummary[];
  setItems: (items: OrderSummary[]) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  items: [],
  setItems: (items) => set({ items })
}));
