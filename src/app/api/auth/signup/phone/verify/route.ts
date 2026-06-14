import { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { authError, authSessionResponse } from '@/app/api/auth/_utils';
import { coerceAuthPayload, phoneVerifySchema, verifyPhoneSignup } from '@/modules/auth/services/auth-service';
import type { LoginResponse } from '@/modules/auth/types';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = phoneVerifySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'VALIDATION_ERROR',
        message: parsed.error.flatten().formErrors.join(', ') || 'Invalid OTP verification payload.'
      }),
      { status: 400 }
    );
  }

  try {
    if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
      const upstream = await requestBackend<unknown>('/auth/signup/phone/verify', {
        method: 'POST',
        body: parsed.data
      });

      if (upstream.status >= 400) {
        return NextResponse.json(upstream.body, { status: upstream.status });
      }

      const auth = coerceAuthPayload(upstream.body.data);
      return authSessionResponse<LoginResponse>(
        {
          session: auth.session
        },
        auth,
        201
      );
    }

    const auth = verifyPhoneSignup(parsed.data);
    return authSessionResponse<LoginResponse>(
      {
        session: auth.session
      },
      auth,
      201
    );
  } catch (error) {
    return authError(error, 'Unable to verify phone signup.');
  }
}
