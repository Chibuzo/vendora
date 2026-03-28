'use client';

import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';

import { ApiClientError, useApiAuthStore } from '../client';
import { getCurrentUser, getPersonalizedRecommendations } from '../endpoints/users';
import type {
  PersonalizedRecommendationResponseData,
  PersonalizedRecommendationsParams,
  User
} from '../types';

type QueryOptions<TResult, TKey extends QueryKey> = Omit<
  UseQueryOptions<TResult, ApiClientError, TResult, TKey>,
  'queryFn' | 'queryKey'
>;

export const userKeys = {
  root: ['user'] as const,
  current: ['user', 'current'] as const,
  recommendations: (params?: PersonalizedRecommendationsParams) =>
    ['user', 'recommendations', params ?? null] as const
};

export function useCurrentUser(options?: QueryOptions<User, typeof userKeys.current>) {
  const accessToken = useApiAuthStore((state) => state.accessToken);
  const hydrated = useApiAuthStore((state) => state.hydrated);

  return useQuery({
    queryKey: userKeys.current,
    queryFn: getCurrentUser,
    enabled: hydrated && Boolean(accessToken) && (options?.enabled ?? true),
    ...options
  });
}

export function usePersonalizedRecommendations(
  params?: PersonalizedRecommendationsParams,
  options?: QueryOptions<
    PersonalizedRecommendationResponseData,
    ReturnType<typeof userKeys.recommendations>
  >
) {
  const accessToken = useApiAuthStore((state) => state.accessToken);
  const hydrated = useApiAuthStore((state) => state.hydrated);

  return useQuery({
    queryKey: userKeys.recommendations(params),
    queryFn: () => getPersonalizedRecommendations(params),
    enabled: hydrated && Boolean(accessToken) && (options?.enabled ?? true),
    ...options
  });
}
