'use client';

import { useQuery } from '@tanstack/react-query';

import { getVendorProfile } from '@/modules/vendors/api/get-vendor-profile';

export function useVendorProfile() {
  return useQuery({
    queryKey: ['vendor-profile'],
    queryFn: getVendorProfile
  });
}
