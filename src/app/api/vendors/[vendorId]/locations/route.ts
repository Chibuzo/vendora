import { NextRequest } from 'next/server';

import { env } from '@/config/env';
import { proxyToBackend } from '@/lib/server-api';
import { updateVendorLocationById } from '@/modules/mock-marketplace/store';
import { error, getSessionUserId, response } from '@/app/api/vendors/_utils';

export async function POST(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ vendorId: string }> }>
) {
  const { vendorId } = await params;

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, `/vendors/${vendorId}/locations`);
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const state = String(body.state ?? '').trim();
    const city = String(body.city ?? '').trim();

    if (!state || !city) {
      return error('State and city are required.', 400, 'VALIDATION_ERROR');
    }

    return response(
      updateVendorLocationById(userId, vendorId, {
        state,
        city,
        address: String(body.address ?? '').trim()
      }),
      201
    );
  } catch (caught) {
    return error(caught instanceof Error ? caught.message : 'Location could not be saved.', 400);
  }
}
