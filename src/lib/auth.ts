import type { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { buyerProtectedRoutes, sharedProtectedRoutes, vendorProtectedRoutes } from '@/shared/constants/routes';

export const SESSION_COOKIE = 'vendora_session';
export const REFRESH_COOKIE = 'vendora_refresh';
export const ROLE_COOKIE = 'vendora_role';
export const SESSION_STATE_COOKIE = 'vendora_session_state';

export type UserRole = 'buyer' | 'vendor' | 'admin';

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
  buyer: [...buyerProtectedRoutes, ...sharedProtectedRoutes, '/onboarding'],
  vendor: [...vendorProtectedRoutes, ...sharedProtectedRoutes, '/onboarding'],
  admin: [...buyerProtectedRoutes, ...vendorProtectedRoutes, ...sharedProtectedRoutes, '/onboarding', '/admin']
};

const ROLE_ALIASES: Record<string, UserRole> = {
  BUYER: 'buyer',
  buyer: 'buyer',
  customer: 'buyer',
  VENDOR: 'vendor',
  vendor: 'vendor',
  ADMIN: 'admin',
  admin: 'admin'
};

export function normalizeUserRole(value?: string | null): UserRole | null {
  if (!value) {
    return null;
  }

  return ROLE_ALIASES[value] ?? null;
}

export function isUserRole(value: string): value is UserRole {
  return normalizeUserRole(value) !== null;
}

export function normalizeSessionUser(payload: unknown): SessionUser | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const candidate = payload as Partial<SessionUser>;
  const role = normalizeUserRole(typeof candidate.role === 'string' ? candidate.role : null);

  if (
    !role ||
    typeof candidate.id !== 'string' ||
    typeof candidate.name !== 'string' ||
    typeof candidate.email !== 'string'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    role,
    email: candidate.email,
    tenantId: typeof candidate.tenantId === 'string' ? candidate.tenantId : undefined
  };
}

export function normalizeSession(payload: unknown): Session | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const candidate = payload as Partial<Session>;
  const user = normalizeSessionUser(candidate.user);

  if (!user || typeof candidate.token !== 'string' || typeof candidate.expiresAt !== 'string') {
    return null;
  }

  return {
    token: candidate.token,
    expiresAt: candidate.expiresAt,
    user
  };
}

export function canAccessPath(role: string | undefined, pathname: string) {
  const normalizedRole = normalizeUserRole(role);

  if (!normalizedRole) {
    return false;
  }

  return protectedRouteMap[normalizedRole].some((segment) => pathname.startsWith(segment));
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
    const parsed = JSON.parse(decoded) as unknown;
    return normalizeSession(parsed);
  } catch {
    return null;
  }
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
  const normalizedSession = normalizeSession(payload.session);

  if (!normalizedSession) {
    throw new Error('Invalid session payload.');
  }

  response.cookies.set(SESSION_COOKIE, normalizedSession.token, {
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

  response.cookies.set(ROLE_COOKIE, normalizedSession.user.role, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: refreshExpiry
  });

  response.cookies.set(SESSION_STATE_COOKIE, serializeSession(normalizedSession), {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: refreshExpiry
  });
}
