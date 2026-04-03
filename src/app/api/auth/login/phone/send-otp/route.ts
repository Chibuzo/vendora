import { NextResponse } from 'next/server';

import { toApiEnvelope } from '@/lib/api-client';
import { authError } from '@/app/api/auth/_utils';
import { phoneAuthSchema, requestPhoneOtp } from '@/modules/auth/services/auth-service';

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
    return NextResponse.json(toApiEnvelope(requestPhoneOtp(parsed.data)));
  } catch (error) {
    return authError(error, 'Unable to send OTP.');
  }
}
