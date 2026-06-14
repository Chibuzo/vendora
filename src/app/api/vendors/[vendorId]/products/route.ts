import { NextRequest } from 'next/server';

import { env } from '@/config/env';
import { proxyToBackend } from '@/lib/server-api';
import { createVendorProduct } from '@/modules/mock-marketplace/store';
import { error, getSessionUserId, response } from '@/app/api/vendors/_utils';

export async function POST(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ vendorId: string }> }>
) {
  const { vendorId } = await params;

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    return proxyToBackend(request, `/vendors/${vendorId}/products`);
  }

  const userId = getSessionUserId(request);

  if (!userId) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const name = String(body.name ?? '').trim();
    const category = String(body.category ?? '').trim();
    const price = Number(body.price ?? 0);
    const imageUrl = String(body.imageUrl ?? '').trim();

    if (!name || !category || price <= 0 || !imageUrl) {
      return error('Product name, category, price, and image URL are required.', 400, 'VALIDATION_ERROR');
    }

    return response(
      createVendorProduct(userId, {
        name,
        category,
        price,
        imageUrl,
        stockQuantity: Number(body.stockQuantity ?? 0),
        description: String(body.description ?? '').trim()
      }),
      201
    );
  } catch (caught) {
    return error(caught instanceof Error ? caught.message : 'Product could not be saved.', 400);
  }
}
