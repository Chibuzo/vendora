import { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { authError } from '@/app/api/auth/_utils';
import { coerceOtpChallenge, phoneAuthSchema, requestPhoneOtp } from '@/modules/auth/services/auth-service';
import type { RequestOtpResponse } from '@/modules/auth/types';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = phoneAuthSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'VALIDATION_ERROR',
        message: parsed.error.flatten().formErrors.join(', ') || 'Invalid phone payload.'
      }),
      { status: 400 }
    );
  }

  try {
    if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
      const upstream = await requestBackend<unknown>('/auth/signup/phone/send-otp', {
        method: 'POST',
        body: parsed.data
      });

      if (upstream.status >= 400) {
        return NextResponse.json(upstream.body, { status: upstream.status });
      }

      return NextResponse.json(toApiEnvelope<RequestOtpResponse>(coerceOtpChallenge(upstream.body.data)));
    }

    return NextResponse.json(toApiEnvelope(requestPhoneOtp(parsed.data)));
  } catch (error) {
    return authError(error, 'Unable to send OTP.');
  }
}
