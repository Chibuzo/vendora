import { NextResponse } from 'next/server';

import { toApiEnvelope } from '@/lib/api-client';
import { authError, authSessionResponse } from '@/app/api/auth/_utils';
import { emailLoginSchema, loginWithEmail } from '@/modules/auth/services/auth-service';

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null);
    const parsed = emailLoginSchema.safeParse(payload);

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
        const auth = loginWithEmail(parsed.data);
        return authSessionResponse(
            {
                session: auth.session
            },
            auth
        );
    } catch (error) {
        return authError(error, 'Unable to sign in.');
    }
}
