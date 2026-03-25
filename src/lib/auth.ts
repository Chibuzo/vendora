import type { NextResponse } from 'next/server';

import { env } from '@/config/env';

export const SESSION_COOKIE = 'vendora_session';
export const ROLE_COOKIE = 'vendora_role';

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

export function setSessionCookies(response: NextResponse, session: Session) {
  const secure = env.NODE_ENV === 'production';

  response.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt)
  });

  response.cookies.set(ROLE_COOKIE, session.user.role, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt)
  });
}
