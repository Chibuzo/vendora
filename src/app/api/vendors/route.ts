import { NextRequest } from 'next/server';

import { env } from '@/config/env';
import { proxyToBackend } from '@/lib/server-api';
import { upsertVendorForUser } from '@/modules/mock-marketplace/store';
import { error, getSessionUserId, response } from '@/app/api/vendors/_utils';

export async function POST(request: NextRequest) {
  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, '/vendors');
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const businessName = String(body.businessName ?? '').trim();
  const category = String(body.category ?? '').trim();
  const phone = String(body.phone ?? '').trim();

  if (!businessName || !category || !phone) {
    return error('Business name, category, and phone are required.', 400, 'VALIDATION_ERROR');
  }

  return response(
    upsertVendorForUser(userId, {
      businessName,
      category,
      phone,
      description: String(body.description ?? '').trim()
    }),
    201
  );
}
