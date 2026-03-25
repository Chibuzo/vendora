'use client';

import { useSearchStore } from '@/modules/search/store/use-search-store';

export function useSearch() {
  return useSearchStore();
}
