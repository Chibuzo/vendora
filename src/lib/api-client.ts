import { logger } from '@/lib/logger';
import type { ApiEnvelope, ApiError, ApiMeta } from '@/shared/types/api';

type JsonRecord = Record<string, unknown>;
type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: BodyInit | JsonRecord | null;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function toJsonBody(body?: BodyInit | JsonRecord | null): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams) {
    return body;
  }

  return JSON.stringify(body);
}

function normalizeMeta(meta?: Partial<ApiMeta>): ApiMeta {
  return {
    timestamp: new Date().toISOString(),
    ...meta
  };
}

export function toApiEnvelope<T>(data: T, meta?: Partial<ApiMeta>, error?: ApiError): ApiEnvelope<T> {
  return {
    data,
    meta: normalizeMeta(meta),
    error
  };
}

function normalizeEnvelope<T>(payload: unknown): ApiEnvelope<T> {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    'meta' in payload &&
    typeof (payload as ApiEnvelope<T>).meta === 'object'
  ) {
    return payload as ApiEnvelope<T>;
  }

  return toApiEnvelope(payload as T);
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    logger.warn('Failed to parse JSON response', {
      status: response.status,
      error
    });
    return null;
  }
}

async function attemptTokenRefresh(baseUrl: string, path: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!baseUrl.startsWith('/') || path.startsWith('/auth/')) {
    return false;
  }

  const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });

  return refreshResponse.ok;
}

async function request<T>(baseUrl: string, path: string, init: JsonRequestInit = {}, allowRetry = true) {
  const headers = new Headers(init.headers);
  const body = toJsonBody(init.body as BodyInit | JsonRecord | undefined);

  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    body,
    credentials: 'include'
  });

  if (response.status === 401 && allowRetry && (await attemptTokenRefresh(baseUrl, path))) {
    return request<T>(baseUrl, path, init, false);
  }

  const payload = await parseJson(response);
  const normalized = normalizeEnvelope<T>(payload);

  if (!response.ok) {
    throw new ApiClientError(
      normalized.error?.message ?? 'Request failed',
      response.status,
      normalized.error
    );
  }

  return normalized;
}

export function createJsonClient(baseUrl: string) {
  return {
    get<T>(path: string, init?: RequestInit) {
      return request<T>(baseUrl, path, {
        ...init,
        method: 'GET'
      });
    },
    post<T, B>(path: string, body: B, init?: Omit<JsonRequestInit, 'body'>) {
      return request<T>(baseUrl, path, {
        ...init,
        method: 'POST',
        body: body as BodyInit | JsonRecord
      });
    },
    patch<T, B>(path: string, body?: B, init?: Omit<JsonRequestInit, 'body'>) {
      return request<T>(baseUrl, path, {
        ...init,
        method: 'PATCH',
        body: body as BodyInit | JsonRecord | undefined
      });
    },
    delete<T>(path: string, init?: Omit<JsonRequestInit, 'body'>) {
      return request<T>(baseUrl, path, {
        ...init,
        method: 'DELETE'
      });
    }
  };
}

export const apiClient = createJsonClient(process.env.NEXT_PUBLIC_API_BASE_PATH ?? '/api');
