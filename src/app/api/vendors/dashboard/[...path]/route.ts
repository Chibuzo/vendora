import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/server-api';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const subpath = params.path.join('/');
  return proxyToBackend(request, `/vendors/dashboard/${subpath}${request.nextUrl.search}`);
}
