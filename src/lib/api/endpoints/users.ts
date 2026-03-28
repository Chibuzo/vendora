import type {
  PersonalizedRecommendationResponse,
  PersonalizedRecommendationResponseData,
  User,
  UserResponse
} from '@/shared/api/generated/model';

import { apiClient, setAuth } from '../client';
import type { PersonalizedRecommendationsParams } from '../types';

export async function getCurrentUser() {
  const user = await apiClient.get<UserResponse, User>('/users/me');

  setAuth({
    user
  });

  return user;
}

export function getPersonalizedRecommendations(params?: PersonalizedRecommendationsParams) {
  return apiClient.get<
    PersonalizedRecommendationResponse,
    PersonalizedRecommendationResponseData
  >('/users/recommendations', {
    params
  });
}
