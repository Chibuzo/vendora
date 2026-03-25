'use client';

import { create } from 'zustand';

import type { ProductFilters } from '@/modules/products/types';

interface ProductFilterState {
  search: string;
  sortBy: ProductFilters['sortBy'];
  setSearch: (search: string) => void;
  setSortBy: (sortBy: ProductFilters['sortBy']) => void;
}

export const useProductFiltersStore = create<ProductFilterState>((set) => ({
  search: '',
  sortBy: 'featured',
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy })
}));
