import { NextResponse } from 'next/server';

import { toApiEnvelope } from '@/lib/api-client';
import { authError, authSessionResponse } from '@/app/api/auth/_utils';
import { phoneVerifySchema, verifyPhoneLogin } from '@/modules/auth/services/auth-service';

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
    const auth = verifyPhoneLogin(parsed.data);
    return authSessionResponse(
      {
        session: auth.session
      },
      auth
    );
  } catch (error) {
    return authError(error, 'Unable to verify phone login.');
  }
}
