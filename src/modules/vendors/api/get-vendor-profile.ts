import { apiClient } from '@/lib/api-client';

import type { VendorProfile } from '@/modules/vendors/types';

export async function getVendorProfile() {
  const response = await apiClient.get<VendorProfile>('/vendors/profile');
  return response.data;
}
