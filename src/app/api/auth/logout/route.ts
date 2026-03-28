import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { clearSessionCookies, REFRESH_COOKIE, SESSION_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { revokeMockRefreshToken } from '@/modules/auth/services/auth-service';
import type { LogoutResponse } from '@/modules/auth/types';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (env.NEXT_PUBLIC_ENABLE_MOCKS) {
    revokeMockRefreshToken(refreshToken);
  } else if (refreshToken || accessToken) {
    await requestBackend<unknown>('/auth/logout', {
      method: 'POST',
      accessToken,
      refreshToken
    }).catch(() => null);
  }

  const response = NextResponse.json(
    toApiEnvelope<LogoutResponse>({
      success: true
    })
  );
  clearSessionCookies(response);
  return response;
}
