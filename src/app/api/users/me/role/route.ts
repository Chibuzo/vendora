import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import {
  normalizeUserRole,
  readSessionState,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  SESSION_STATE_COOKIE,
  setSessionCookies,
  type AuthCookiePayload,
  type Session
} from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { mapUserToApiUser, mapUserToSessionUser, updateUserRole } from '@/modules/mock-marketplace/store';

function error(message: string, status = 400, code = 'BAD_REQUEST') {
  return NextResponse.json(
    toApiEnvelope<null>(null, undefined, {
      code,
      message
    }),
    { status }
  );
}

function buildAuthPayload(session: Session, refreshToken: string | undefined, nextUser: Session['user']): AuthCookiePayload {
  return {
    session: {
      ...session,
      user: nextUser
    },
    refreshToken: refreshToken ?? session.token,
    refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
  };
}

function extractRole(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const data = record.data && typeof record.data === 'object' ? record.data as Record<string, unknown> : record;
  const user = data.user && typeof data.user === 'object' ? data.user as Record<string, unknown> : data;
  const role = typeof user.role === 'string' ? normalizeUserRole(user.role) : null;

  return role;
}

export async function PATCH(request: NextRequest) {
  const session = readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value);
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const body = (await request.json().catch(() => null)) as { role?: unknown } | null;
  const role = body?.role === 'BUYER' || body?.role === 'VENDOR' ? body.role : null;

  if (!session) {
    return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
  }

  if (!role) {
    return error('Role must be BUYER or VENDOR.', 400, 'VALIDATION_ERROR');
  }

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    const upstream = await requestBackend<unknown>('/users/me/role', {
      method: 'PATCH',
      body: { role },
      accessToken
    });
    const response = NextResponse.json(upstream.body, { status: upstream.status });
    const updatedRole = extractRole(upstream.body) ?? normalizeUserRole(role);

    if (upstream.status < 400 && updatedRole) {
      setSessionCookies(
        response,
        buildAuthPayload(session, refreshToken, {
          ...session.user,
          role: updatedRole
        })
      );
    }

    return response;
  }

  const user = updateUserRole(session.user.id, role);
  const apiUser = mapUserToApiUser(user);
  const response = NextResponse.json(toApiEnvelope(apiUser));
  setSessionCookies(response, buildAuthPayload(session, refreshToken, mapUserToSessionUser(user)));

  return response;
}
