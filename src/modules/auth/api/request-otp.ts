import { apiClient } from '@/lib/api-client';

import type { RequestOtpInput, RequestOtpResponse } from '@/modules/auth/types';

export async function requestOtp(payload: RequestOtpInput) {
  const response = await apiClient.post<RequestOtpResponse, RequestOtpInput>('/auth/request-otp', payload);
  return response.data;
}
