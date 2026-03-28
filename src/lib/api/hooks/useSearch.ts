'use client';

import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions
} from '@tanstack/react-query';

import { ApiClientError } from '../client';
import { getSearchSuggestions, searchVendors, trackMarketplaceActivity } from '../endpoints/search';
import type { ActivityRequest, Empty, SearchListData, SearchParams, SearchSuggestionData } from '../types';

type QueryOptions<TResult, TKey extends QueryKey> = Omit<
  UseQueryOptions<TResult, ApiClientError, TResult, TKey>,
  'queryFn' | 'queryKey'
>;

type MutationOptions<TResult, TVariables, TOnMutateResult = unknown> = Omit<
  UseMutationOptions<TResult, ApiClientError, TVariables, TOnMutateResult>,
  'mutationFn' | 'mutationKey'
>;

export const searchKeys = {
  results: (params?: SearchParams) => ['search', params ?? null] as const,
  suggestions: (query: string, limit?: number) => ['search', 'suggestions', query, limit ?? null] as const
};

export function useSearch(
  params?: SearchParams,
  options?: QueryOptions<SearchListData, ReturnType<typeof searchKeys.results>>
) {
  return useQuery({
    queryKey: searchKeys.results(params),
    queryFn: () => searchVendors(params),
    ...options
  });
}

export function useSearchSuggestions(
  query: string,
  limit = 10,
  options?: QueryOptions<SearchSuggestionData, ReturnType<typeof searchKeys.suggestions>>
) {
  return useQuery({
    queryKey: searchKeys.suggestions(query, limit),
    queryFn: () =>
      getSearchSuggestions({
        query,
        limit
      }),
    enabled: query.trim().length > 0 && (options?.enabled ?? true),
    ...options
  });
}

export function useTrackMarketplaceActivity(
  options?: MutationOptions<Empty, ActivityRequest>
) {
  return useMutation<Empty, ApiClientError, ActivityRequest>({
    mutationKey: ['search', 'track-activity'],
    mutationFn: trackMarketplaceActivity,
    ...options
  });
}
