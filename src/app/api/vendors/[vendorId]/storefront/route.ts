import { NextRequest } from 'next/server';

import { env } from '@/config/env';
import { proxyToBackend } from '@/lib/server-api';
import { updateVendorStorefront } from '@/modules/mock-marketplace/store';
import { error, getSessionUserId, response } from '@/app/api/vendors/_utils';

function nullable(value: unknown) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || null;
}

export async function PATCH(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ vendorId: string }> }>
) {
  const { vendorId } = await params;

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, `/vendors/${vendorId}/storefront`);
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    return response(
      updateVendorStorefront(userId, vendorId, {
        logoUrl: nullable(body.logoUrl),
        bannerUrl: nullable(body.bannerUrl),
        instagramUrl: nullable(body.instagramUrl),
        whatsappUrl: nullable(body.whatsappUrl)
      })
    );
  } catch (caught) {
    return error(caught instanceof Error ? caught.message : 'Storefront could not be saved.', 400);
  }
}
