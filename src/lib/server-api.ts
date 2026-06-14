import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { SESSION_COOKIE } from '@/lib/auth';
import { createJsonClient, toApiEnvelope } from '@/lib/api-client';

export const serverApiClient = createJsonClient(env.BACKEND_API_URL);

function normalizeEnvelope<T>(payload: unknown) {
    if (
        payload &&
        typeof payload === 'object' &&
        'data' in payload &&
        'meta' in payload &&
        typeof (payload as { meta: unknown }).meta === 'object'
    ) {
        return payload;
    }

    return toApiEnvelope(payload as T);
}

async function parseJson(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text) as unknown;
}

type BackendRequestInit = Omit<RequestInit, 'body'> & {
    body?: BodyInit | Record<string, unknown> | null;
    accessToken?: string | null;
    refreshToken?: string | null;
};

function toJsonBody(body?: BodyInit | Record<string, unknown> | null): BodyInit | undefined {
    if (body === undefined || body === null) {
        return undefined;
    }

    if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams) {
        return body;
    }

    return JSON.stringify(body);
}

export async function requestBackend<T>(path: string, init: BackendRequestInit = {}) {
    const headers = new Headers({
        Accept: 'application/json'
    });
    const body = toJsonBody(init.body);

    new Headers(init.headers).forEach((value, key) => {
        headers.set(key, value);
    });

    if (body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (init.accessToken) {
        headers.set('Authorization', `Bearer ${init.accessToken}`);
    }

    if (init.refreshToken) {
        headers.set('x-refresh-token', init.refreshToken);
    }

    if (env.BACKEND_API_KEY) {
        headers.set('x-api-key', env.BACKEND_API_KEY);
    }

    const response = await fetch(`${env.BACKEND_API_URL}${path}`, {
        ...init,
        headers,
        body
    });

    const payload = await parseJson(response);

    return {
        status: response.status,
        body: normalizeEnvelope<T>(payload),
        headers: response.headers
    };
}

export async function proxyToBackend<T>(request: NextRequest, path: string) {
    const headers = new Headers({
        Accept: 'application/json'
    });

    const contentType = request.headers.get('content-type');
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

    if (contentType) {
        headers.set('Content-Type', contentType);
    }

    if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken}`);
    }

    const upstream = await requestBackend<T>(path, {
        method: request.method,
        headers,
        body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
        accessToken: sessionToken
    });

    return NextResponse.json(upstream.body, {
        status: upstream.status
    });
}
