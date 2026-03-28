import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  canAccessPath,
  getLoginRedirectUrl,
  normalizeUserRole,
  REFRESH_COOKIE,
  ROLE_COOKIE,
  SESSION_COOKIE
} from '@/lib/auth';
import { resolveTenant } from '@/lib/tenant';
import { routes } from '@/shared/constants/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tenant = resolveTenant({
    pathname,
    host: request.headers.get('host') ?? ''
  });

  const requestHeaders = new Headers(request.headers);

  if (tenant.slug) {
    requestHeaders.set('x-tenant-slug', tenant.slug);
    requestHeaders.set('x-tenant-source', tenant.source);
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_COOKIE)?.value);
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  const isProtected =
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/home') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/profile');

  if (isProtected && !hasSession && !hasRefreshToken) {
    return NextResponse.redirect(new URL(getLoginRedirectUrl(pathname), request.url));
  }

  if (isProtected && !role) {
    return NextResponse.redirect(new URL(getLoginRedirectUrl(pathname), request.url));
  }

  if (isProtected && !canAccessPath(role, pathname)) {
    const normalizedRole = normalizeUserRole(role);
    const fallback =
      normalizedRole === 'vendor'
        ? routes.vendor.dashboard
        : normalizedRole === 'admin'
          ? routes.admin.dashboard
          : routes.buyer.home;

    return NextResponse.redirect(new URL(fallback, request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
