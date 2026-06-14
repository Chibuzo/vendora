import { NextRequest, NextResponse } from 'next/server';

import { readSessionState, SESSION_STATE_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';

export function response<T>(data: T, status = 200) {
  return NextResponse.json(toApiEnvelope(data), { status });
}

export function error(message: string, status = 400, code = 'BAD_REQUEST') {
  return NextResponse.json(
    toApiEnvelope<null>(null, undefined, {
      code,
      message
    }),
    { status }
  );
}

export function getSessionUserId(request: NextRequest) {
  return readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value)?.user.id ?? null;
}
