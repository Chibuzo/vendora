'use client';

import { create } from 'zustand';

interface CartState {
  isDrawerOpen: boolean;
  itemCount: number;
  subtotal: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isDrawerOpen: false,
  itemCount: 3,
  subtotal: 187000,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen }))
}));
