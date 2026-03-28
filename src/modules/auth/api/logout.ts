import { apiClient } from '@/lib/api-client';

import type { LogoutResponse } from '@/modules/auth/types';

export async function logout() {
  const response = await apiClient.post<LogoutResponse, Record<string, never>>('/auth/logout', {});
  return response.data;
}
