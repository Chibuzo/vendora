'use client';

import { useTrustStore } from '@/modules/trust/store/use-trust-store';

export function useTrust() {
  return useTrustStore();
}
