import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { SESSION_COOKIE } from '@/lib/auth';
import { createJsonClient, toApiEnvelope } from '@/lib/api-client';

export const serverApiClient = createJsonClient(env.BACKEND_API_URL);

function normalizeEnvelope<T>(payload: unknown) {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    'meta' in payload &&
    typeof (payload as { meta: unknown }).meta === 'object'
  ) {
    return payload;
  }

  return toApiEnvelope(payload as T);
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as unknown;
}

export async function proxyToBackend<T>(request: NextRequest, path: string) {
  const headers = new Headers({
    Accept: 'application/json'
  });

  const contentType = request.headers.get('content-type');
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  if (sessionToken) {
    headers.set('Authorization', `Bearer ${sessionToken}`);
  }

  if (env.BACKEND_API_KEY) {
    headers.set('x-api-key', env.BACKEND_API_KEY);
  }

  const upstream = await fetch(`${env.BACKEND_API_URL}${path}`, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text()
  });

  const payload = await parseJson(upstream);
  const normalized = normalizeEnvelope<T>(payload);

  return NextResponse.json(normalized, {
    status: upstream.status
  });
}
