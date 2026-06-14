import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { readSessionState, SESSION_STATE_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { proxyToBackend } from '@/lib/server-api';
import { getLegacyMockVendorProfile } from '@/modules/mock-marketplace/store';
import type { VendorProfile } from '@/modules/vendors/types';

export async function GET(request: NextRequest) {
  if (env.NEXT_PUBLIC_ENABLE_MOCKS) {
    const session = readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value);
    const profile = getLegacyMockVendorProfile(session?.user.id);

    if (!profile) {
      return NextResponse.json(
        toApiEnvelope<null>(null, undefined, {
          code: 'NOT_FOUND',
          message: 'Vendor profile not found.'
        }),
        { status: 404 }
      );
    }

    return NextResponse.json(toApiEnvelope<VendorProfile>(profile));
  }

  return proxyToBackend<VendorProfile>(request, '/vendors/profile');
}
