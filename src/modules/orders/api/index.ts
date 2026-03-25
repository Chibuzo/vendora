import { apiClient } from '@/lib/api-client';

import type { OrderSummary } from '@/modules/orders/types';

export async function getOrders() {
  const response = await apiClient.get<OrderSummary[]>('/orders');
  return response.data;
}
