import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { canAccessPath, getLoginRedirectUrl, REFRESH_COOKIE, ROLE_COOKIE, SESSION_COOKIE } from '@/lib/auth';
import { resolveTenant } from '@/lib/tenant';

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
    pathname.startsWith('/orders');

  if (isProtected && !hasSession && !hasRefreshToken) {
    return NextResponse.redirect(new URL(getLoginRedirectUrl(pathname), request.url));
  }

  if (isProtected && !role) {
    return NextResponse.redirect(new URL(getLoginRedirectUrl(pathname), request.url));
  }

  if (isProtected && !canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL('/marketplace', request.url));
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
