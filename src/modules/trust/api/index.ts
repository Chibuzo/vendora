import { apiClient } from '@/lib/api-client';

import type { FraudReport } from '@/modules/trust/types';

export async function getFraudReports() {
  const response = await apiClient.get<FraudReport[]>('/trust/reports');
  return response.data;
}
