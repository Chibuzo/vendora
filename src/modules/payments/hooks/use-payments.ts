'use client';

import { usePaymentsStore } from '@/modules/payments/store/use-payments-store';

export function usePayments() {
  return usePaymentsStore();
}
