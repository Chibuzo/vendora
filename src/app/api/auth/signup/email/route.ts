import { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { authError, authSessionResponse } from '@/app/api/auth/_utils';
import { coerceAuthPayload, emailSignupSchema, signupWithEmail } from '@/modules/auth/services/auth-service';
import type { LoginResponse } from '@/modules/auth/types';

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null);
    const parsed = emailSignupSchema.safeParse(payload);

    if (!parsed.success) {
        const flattened = parsed.error.flatten();
        const errorMessage = flattened.formErrors.length > 0
            ? flattened.formErrors.join(', ')
            : Object.values(flattened.fieldErrors).flat().join(', ') || 'Invalid signup payload.'
        return NextResponse.json(
            toApiEnvelope<null>(null, undefined, {
                code: 'VALIDATION_ERROR',
                message: errorMessage
            }),
            { status: 400 }
        );
    }

    try {
        if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
            const upstream = await requestBackend<unknown>('/auth/register', {
                method: 'POST',
                body: {
                    name: parsed.data.fullName,
                    email: parsed.data.email,
                    password: parsed.data.password
                }
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

        const auth = signupWithEmail(parsed.data);
        return authSessionResponse<LoginResponse>(
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
