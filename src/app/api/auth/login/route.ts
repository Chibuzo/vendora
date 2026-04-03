import { NextResponse } from 'next/server';

import { env } from '@/config/env';
import { setSessionCookies } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { requestBackend } from '@/lib/server-api';
import { coerceAuthPayload, loginSchema, verifyMockOtpLogin } from '@/modules/auth/services/auth-service';
import type { LoginResponse } from '@/modules/auth/types';

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
        const flattened = parsed.error.flatten();
        const errorMessage = flattened.formErrors.length > 0
            ? flattened.formErrors.join(', ')
            : Object.values(flattened.fieldErrors).flat().join(', ') || 'Invalid login payload.';
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
            const upstream = await requestBackend<unknown>('/auth/login', {
                method: 'POST',
                body: parsed.data
            });

            if (upstream.status >= 400) {
                return NextResponse.json(upstream.body, { status: upstream.status });
            }

            const authPayload = coerceAuthPayload(upstream.body.data);
            const response = NextResponse.json(
                toApiEnvelope<LoginResponse>({
                    session: authPayload.session
                })
            );
            setSessionCookies(response, authPayload);
            return response;
        }

        const authPayload = verifyMockOtpLogin(parsed.data);
        const response = NextResponse.json(
            toApiEnvelope<LoginResponse>({
                session: authPayload.session
            })
        );
        setSessionCookies(response, authPayload);
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to complete login.';
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
