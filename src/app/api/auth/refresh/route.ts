import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { clearSessionCookies, REFRESH_COOKIE, SESSION_COOKIE, setSessionCookies } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { coerceAuthPayload, refreshMockSession } from '@/modules/auth/services/auth-service';
import type { LoginResponse } from '@/modules/auth/types';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!refreshToken) {
    const response = NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'REFRESH_TOKEN_MISSING',
        message: 'Your session has expired. Sign in again.'
      }),
      { status: 401 }
    );
    clearSessionCookies(response);
    return response;
  }

  try {
    if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
      const upstream = await requestBackend<unknown>('/auth/refresh', {
        method: 'POST',
        accessToken,
        refreshToken
      });

      if (upstream.status >= 400) {
        const response = NextResponse.json(upstream.body, { status: upstream.status });
        clearSessionCookies(response);
        return response;
      }

      const refreshedAuth = coerceAuthPayload(upstream.body.data, refreshToken);
      const response = NextResponse.json(
        toApiEnvelope<LoginResponse>({
          session: refreshedAuth.session
        })
      );
      setSessionCookies(response, refreshedAuth);
      return response;
    }

    const authPayload = refreshMockSession(refreshToken);
    const response = NextResponse.json(
      toApiEnvelope<LoginResponse>({
        session: authPayload.session
      })
    );
    setSessionCookies(response, authPayload);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to refresh session.';
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : 'AUTH_ERROR';
    const status = typeof error === 'object' && error && 'status' in error ? Number(error.status) : 401;
    const response = NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code,
        message
      }),
      { status }
    );
    clearSessionCookies(response);
    return response;
  }
}
