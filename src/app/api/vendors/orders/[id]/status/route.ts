import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/server-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(request, `/vendors/orders/${params.id}/status`);
}
