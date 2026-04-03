import { NextRequest, NextResponse } from 'next/server';

import { readSessionState, SESSION_STATE_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { findUserById, mapUserToApiUser } from '@/modules/mock-marketplace/store';

export async function GET(request: NextRequest) {
  const session = readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value);

  if (!session) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to continue.'
      }),
      { status: 401 }
    );
  }

  const user = findUserById(session.user.id);

  return NextResponse.json(toApiEnvelope(user ? mapUserToApiUser(user) : null));
}
