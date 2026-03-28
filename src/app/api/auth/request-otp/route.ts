import { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { coerceOtpChallenge, createMockOtpChallenge, requestOtpSchema } from '@/modules/auth/services/auth-service';
import type { RequestOtpResponse } from '@/modules/auth/types';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = requestOtpSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'VALIDATION_ERROR',
        message: parsed.error.flatten().formErrors.join(', ') || 'Invalid OTP request payload.'
      }),
      { status: 400 }
    );
  }

  try {
    if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
      const upstream = await requestBackend<unknown>('/auth/request-otp', {
        method: 'POST',
        body: parsed.data
      });

      if (upstream.status >= 400) {
        return NextResponse.json(upstream.body, { status: upstream.status });
      }

      return NextResponse.json(toApiEnvelope<RequestOtpResponse>(coerceOtpChallenge(upstream.body.data)));
    }

    const otpResponse = createMockOtpChallenge(parsed.data.identifier);
    return NextResponse.json(toApiEnvelope<RequestOtpResponse>(otpResponse));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to request OTP.';
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : 'AUTH_ERROR';
    const status = typeof error === 'object' && error && 'status' in error ? Number(error.status) : 500;

    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code,
        message
      }),
      { status }
    );
  }
}
