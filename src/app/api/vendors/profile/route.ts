import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { toApiEnvelope } from '@/lib/api-client';
import { proxyToBackend } from '@/lib/server-api';
import type { VendorProfile } from '@/modules/vendors/types';
import { mockVendorProfile } from '@/shared/constants/mock-data';

export async function GET(request: NextRequest) {
  if (env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return NextResponse.json(toApiEnvelope<VendorProfile>(mockVendorProfile));
  }

  return proxyToBackend<VendorProfile>(request, '/vendors/profile');
}
