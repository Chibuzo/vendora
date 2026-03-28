import type {
  Empty,
  EmptyResponse,
  SearchResponse,
  SearchSuggestionData,
  SearchSuggestionsResponse
} from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type { ActivityRequest, SearchListData, SearchParams, SearchSuggestionsParams } from '../types';

export function searchVendors(params?: SearchParams) {
  return apiClient.get<SearchResponse, SearchListData>('/search', {
    params
  });
}

export function getSearchSuggestions(query: string | SearchSuggestionsParams, limit?: number) {
  const params =
    typeof query === 'string'
      ? ({
          query,
          limit
        } satisfies SearchSuggestionsParams)
      : query;

  return apiClient.get<SearchSuggestionsResponse, SearchSuggestionData>('/search/suggestions', {
    params
  });
}

export function trackMarketplaceActivity(data: ActivityRequest) {
  return apiClient.post<EmptyResponse, ActivityRequest, Empty>('/activities', data);
}
