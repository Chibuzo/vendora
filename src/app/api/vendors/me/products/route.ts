import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/server-api';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/vendors/me/products');
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/vendors/me/products' + request.nextUrl.search);
}

