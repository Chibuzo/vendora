'use client';

import { useOrdersStore } from '@/modules/orders/store/use-orders-store';

export function useOrders() {
  return useOrdersStore();
}
