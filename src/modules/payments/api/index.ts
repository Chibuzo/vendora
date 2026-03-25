import { apiClient } from '@/lib/api-client';

import type { PaymentMethod } from '@/modules/payments/types';

export async function getPaymentMethods() {
  const response = await apiClient.get<PaymentMethod[]>('/payments');
  return response.data;
}
