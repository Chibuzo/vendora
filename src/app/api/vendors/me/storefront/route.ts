import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/server-api';

export async function PATCH(request: NextRequest) {
  return proxyToBackend(request, '/vendors/me/storefront');
}
