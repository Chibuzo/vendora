import { NextResponse } from 'next/server';

import { toApiEnvelope } from '@/lib/api-client';
import { authError, authSessionResponse } from '@/app/api/auth/_utils';
import { emailSignupSchema, signupWithEmail } from '@/modules/auth/services/auth-service';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = emailSignupSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'VALIDATION_ERROR',
        message: parsed.error.flatten().formErrors.join(', ') || 'Invalid signup payload.'
      }),
      { status: 400 }
    );
  }

  try {
    const auth = signupWithEmail(parsed.data);
    return authSessionResponse(
      {
        session: auth.session
      },
      auth,
      201
    );
  } catch (error) {
    return authError(error, 'Unable to create account.');
  }
}
