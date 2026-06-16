import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { readSessionState, SESSION_COOKIE, SESSION_STATE_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { authError, authSessionResponse } from '@/app/api/auth/_utils';
import { coerceAuthPayload, completeMockSignup, completeSignupSchema } from '@/modules/auth/services/auth-service';

export async function POST(request: NextRequest) {
  const session = readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value);
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await request.json().catch(() => null);
  const parsed = completeSignupSchema.safeParse(payload);

  if (!session) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to continue.'
      }),
      { status: 401 }
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      toApiEnvelope<null>(null, undefined, {
        code: 'VALIDATION_ERROR',
        message: parsed.error.flatten().formErrors.join(', ') || 'Invalid profile payload.'
      }),
      { status: 400 }
    );
  }

  try {
    if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
      const upstream = await requestBackend<unknown>('/auth/signup/complete', {
        method: 'POST',
        body: parsed.data,
        accessToken
      });

      if (upstream.status >= 400) {
        return NextResponse.json(upstream.body, { status: upstream.status });
      }

      const auth = coerceAuthPayload(
        typeof upstream.body === 'object' && upstream.body && 'data' in upstream.body
          ? (upstream.body as { data: unknown }).data
          : upstream.body
      );

      // The frontend useAuth hook expects an ApiUser shaped response
      const userResponse = {
        id: auth.session.user.id,
        fullName: auth.session.user.name,
        email: auth.session.user.email,
        phone: auth.session.user.phone,
        role: auth.session.user.role.toUpperCase()
      };

      return authSessionResponse(userResponse, auth, 200);
    }

    const result = completeMockSignup(session.user.id, parsed.data);
    return authSessionResponse(result.user, result.auth);
  } catch (error) {
    return authError(error, 'Unable to update profile.');
  }
}
