import { NextRequest } from 'next/server';

import { env } from '@/config/env';
import { proxyToBackend } from '@/lib/server-api';
import { submitVendorVerification } from '@/modules/mock-marketplace/store';
import { error, getSessionUserId, response } from '@/app/api/vendors/_utils';

export async function POST(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ vendorId: string }> }>
) {
  const { vendorId } = await params;

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, `/vendors/${vendorId}/verification`);
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const cacNumber = String(body.cacNumber ?? '').trim();

    if (!cacNumber) {
      return error('CAC number is required.', 400, 'VALIDATION_ERROR');
    }

    return response(
      submitVendorVerification(userId, {
        vendorId,
        cacNumber,
        governmentIdUrl: String(body.governmentIdUrl ?? '').trim(),
        businessProofUrl: String(body.businessProofUrl ?? '').trim(),
        socialMediaUrl: String(body.socialMediaUrl ?? '').trim()
      }),
      201
    );
  } catch (caught) {
    return error(caught instanceof Error ? caught.message : 'Verification could not be submitted.', 400);
  }
}
