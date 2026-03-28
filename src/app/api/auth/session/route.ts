import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import {
  clearSessionCookies,
  readSessionState,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  SESSION_STATE_COOKIE,
  setSessionCookies
} from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { coerceAuthPayload, refreshMockSession } from '@/modules/auth/services/auth-service';
import type { SessionResponse } from '@/modules/auth/types';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const sessionState = readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value);

  if (accessToken && sessionState && Date.parse(sessionState.expiresAt) > Date.now()) {
    return NextResponse.json(
      toApiEnvelope<SessionResponse>({
        session: sessionState
      })
    );
  }

  if (!refreshToken) {
    const response = NextResponse.json(
      toApiEnvelope<SessionResponse>({
        session: null
      })
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
        throw new Error('Unable to refresh session.');
      }

      const refreshedAuth = coerceAuthPayload(upstream.body.data, refreshToken);
      const response = NextResponse.json(
        toApiEnvelope<SessionResponse>({
          session: refreshedAuth.session
        })
      );
      setSessionCookies(response, refreshedAuth);
      return response;
    }

    const authPayload = refreshMockSession(refreshToken);
    const response = NextResponse.json(
      toApiEnvelope<SessionResponse>({
        session: authPayload.session
      })
    );
    setSessionCookies(response, authPayload);
    return response;
  } catch {
    const response = NextResponse.json(
      toApiEnvelope<SessionResponse>({
        session: null
      })
    );
    clearSessionCookies(response);
    return response;
  }
}
