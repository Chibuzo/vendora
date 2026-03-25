import { apiClient } from '@/lib/api-client';

import type { LoginInput, LoginResponse } from '@/modules/auth/types';

export async function login(payload: LoginInput) {
  const response = await apiClient.post<LoginResponse, LoginInput>('/auth/login', payload);
  return response.data;
}
