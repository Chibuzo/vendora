import { NextResponse } from 'next/server';

import { setSessionCookies } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import type { AuthCookiePayload } from '@/lib/auth';

export function authError(error: unknown, fallback = 'Authentication request failed.') {
  const message = error instanceof Error ? error.message : fallback;
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : 'AUTH_ERROR';
  const status = typeof error === 'object' && error && 'status' in error ? Number(error.status) : 500;

  return NextResponse.json(
    toApiEnvelope<null>(null, undefined, {
      code,
      message
    }),
    { status }
  );
}

export function authSessionResponse<T>(data: T, auth: AuthCookiePayload, status = 200) {
  const response = NextResponse.json(toApiEnvelope(data), { status });
  setSessionCookies(response, auth);
  return response;
}
