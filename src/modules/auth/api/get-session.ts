import { apiClient } from '@/lib/api-client';

import type { SessionResponse } from '@/modules/auth/types';

export async function getSession() {
  const response = await apiClient.get<SessionResponse>('/auth/session');
  return response.data;
}
