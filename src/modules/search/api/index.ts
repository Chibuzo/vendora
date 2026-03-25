import { apiClient } from '@/lib/api-client';

import type { SearchResult } from '@/modules/search/types';

export async function getSearchResults(query: string) {
  const response = await apiClient.get<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
}
