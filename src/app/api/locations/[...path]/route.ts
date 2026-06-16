import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/server-api';

export async function GET(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ path: string[] }> }>
) {
  const { path } = await params;
  return proxyToBackend(request, `/locations/${path.join('/')}`);
}
