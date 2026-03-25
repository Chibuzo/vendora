import { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { setSessionCookies } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { serverApiClient } from '@/lib/server-api';
import { createMockSession, loginSchema } from '@/modules/auth/services/auth-service';
import type { LoginResponse } from '@/modules/auth/types';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      toApiEnvelope(
        {
          session: {
            token: '',
            expiresAt: new Date(0).toISOString(),
            user: {
              id: '',
              name: '',
              role: 'customer',
              email: ''
            }
          }
        } satisfies LoginResponse,
        undefined,
        {
          code: 'VALIDATION_ERROR',
          message: parsed.error.flatten().formErrors.join(', ') || 'Invalid login payload.'
        }
      ),
      { status: 400 }
    );
  }

  if (env.NEXT_PUBLIC_ENABLE_MOCKS && parsed.data.otp !== '123456') {
    return NextResponse.json(
      toApiEnvelope(
        {
          session: {
            token: '',
            expiresAt: new Date(0).toISOString(),
            user: {
              id: '',
              name: '',
              role: 'customer',
              email: parsed.data.identifier
            }
          }
        } satisfies LoginResponse,
        undefined,
        {
          code: 'INVALID_OTP',
          message: 'The provided OTP is invalid.'
        }
      ),
      { status: 401 }
    );
  }

  const session =
    env.NEXT_PUBLIC_ENABLE_MOCKS
      ? createMockSession(parsed.data.identifier)
      : (await serverApiClient.post<LoginResponse, typeof parsed.data>('/auth/login', parsed.data)).data
          .session;

  const response = NextResponse.json(toApiEnvelope<LoginResponse>({ session }));
  setSessionCookies(response, session);
  return response;
}
