import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { readSessionState, SESSION_COOKIE, SESSION_STATE_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { findUserById, mapUserToApiUser } from '@/modules/mock-marketplace/store';

export async function GET(request: NextRequest) {
  const session = readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value);
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!session) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to continue.'
      }),
      { status: 401 }
    );
  }

  if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
    const upstream = await requestBackend<unknown>('/auth/me', {
      method: 'GET',
      accessToken
    });

    return NextResponse.json(upstream.body, { status: upstream.status });
  }

  const user = findUserById(session.user.id);

  return NextResponse.json(toApiEnvelope(user ? mapUserToApiUser(user) : null));
}
