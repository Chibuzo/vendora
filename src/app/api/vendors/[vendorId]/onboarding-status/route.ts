import { NextRequest } from 'next/server';

import { env } from '@/config/env';
import { proxyToBackend } from '@/lib/server-api';
import { completeVendorOnboarding, getVendorOnboardingStatus } from '@/modules/mock-marketplace/store';
import { error, getSessionUserId, response } from '@/app/api/vendors/_utils';

export async function GET(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ vendorId: string }> }>
) {
  const { vendorId } = await params;

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, `/vendors/${vendorId}/onboarding-status`);
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  try {
    return response(getVendorOnboardingStatus(userId, vendorId));
  } catch (caught) {
    return error(caught instanceof Error ? caught.message : 'Onboarding status unavailable.', 404, 'NOT_FOUND');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ vendorId: string }> }>
) {
  const { vendorId } = await params;

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, `/vendors/${vendorId}/onboarding-status`);
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    return response(
      completeVendorOnboarding(userId, vendorId, body.onboardingCompleted === true)
    );
  } catch (caught) {
    return error(caught instanceof Error ? caught.message : 'Onboarding status could not be updated.', 400);
  }
}
