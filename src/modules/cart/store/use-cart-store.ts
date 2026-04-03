'use client';

import { create } from 'zustand';

interface CartState {
  isDrawerOpen: boolean;
  itemCount: number;
  subtotal: number;
  syncCart: (payload: { itemCount: number; subtotal: number }) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isDrawerOpen: false,
  itemCount: 0,
  subtotal: 0,
  syncCart: (payload) =>
    set({
      itemCount: payload.itemCount,
      subtotal: payload.subtotal
    }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen }))
}));
