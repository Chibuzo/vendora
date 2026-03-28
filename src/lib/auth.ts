import type { NextResponse } from 'next/server';

import { env } from '@/config/env';

export const SESSION_COOKIE = 'vendora_session';
export const REFRESH_COOKIE = 'vendora_refresh';
export const ROLE_COOKIE = 'vendora_role';
export const SESSION_STATE_COOKIE = 'vendora_session_state';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  tenantId?: string;
}

export interface Session {
  token: string;
  expiresAt: string;
  user: SessionUser;
}

export interface AuthCookiePayload {
  session: Session;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

const protectedRouteMap: Record<UserRole, string[]> = {
  customer: ['/marketplace', '/orders'],
  vendor: ['/marketplace', '/orders', '/vendor'],
  admin: ['/marketplace', '/orders', '/vendor', '/admin']
};

export function isUserRole(value: string): value is UserRole {
  return ['customer', 'vendor', 'admin'].includes(value);
}

export function canAccessPath(role: string | undefined, pathname: string) {
  if (!role || !isUserRole(role)) {
    return false;
  }

  return protectedRouteMap[role].some((segment) => pathname.startsWith(segment));
}

export function getLoginRedirectUrl(pathname: string) {
  const query = new URLSearchParams({
    redirectTo: pathname
  });

  return `/login?${query.toString()}`;
}

function serializeSession(session: Session) {
  return encodeURIComponent(JSON.stringify(session));
}

export function readSessionState(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as Session;

    if (
      typeof parsed?.token === 'string' &&
      typeof parsed?.expiresAt === 'string' &&
      typeof parsed?.user?.role === 'string'
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearSessionCookies(response: NextResponse) {
  for (const name of [SESSION_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, SESSION_STATE_COOKIE]) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0)
    });
  }
}

export function setSessionCookies(response: NextResponse, payload: AuthCookiePayload) {
  const secure = env.NODE_ENV === 'production';
  const sessionExpiry = new Date(payload.session.expiresAt);
  const refreshExpiry = new Date(payload.refreshTokenExpiresAt);

  response.cookies.set(SESSION_COOKIE, payload.session.token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: sessionExpiry
  });

  response.cookies.set(REFRESH_COOKIE, payload.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: refreshExpiry
  });

  response.cookies.set(ROLE_COOKIE, payload.session.user.role, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: refreshExpiry
  });

  response.cookies.set(SESSION_STATE_COOKIE, serializeSession(payload.session), {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: refreshExpiry
  });
}
