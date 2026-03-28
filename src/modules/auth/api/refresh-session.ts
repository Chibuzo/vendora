import { apiClient } from '@/lib/api-client';

import type { LoginResponse } from '@/modules/auth/types';

export async function refreshSession() {
  const response = await apiClient.post<LoginResponse, Record<string, never>>('/auth/refresh', {});
  return response.data;
}
