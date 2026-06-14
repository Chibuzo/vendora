import { QueryClient } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { User } from '@/shared/api/generated/model';

import type {
  ApiEnvelope,
  ApiError,
  ApiErrorDetails,
  ApiQueryParams,
  ApiQueryPrimitive,
  AuthState,
  SetAuthInput
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_PATH ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
const AUTH_STORAGE_KEY = 'vendora.api.auth';
const REFRESH_PATHS = ['/auth/tokens/refresh', '/auth/refresh'] as const;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
type RequestBody = BodyInit | Record<string, unknown> | null | undefined;

type RequestOptions<TBody> = {
  method: HttpMethod;
  path: string;
  body?: TBody;
  params?: ApiQueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
  skipAuth?: boolean;
  retryOnAuthError?: boolean;
};

type AuthStoreState = AuthState & {
  hydrated: boolean;
};

type RefreshTokenPayload = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

const defaultAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null
};

const authStore = createStore<AuthStoreState>(() => ({
  ...defaultAuthState,
  hydrated: false
}));

let refreshPromise: Promise<string | null> | null = null;

export class ApiClientError extends Error implements ApiError {
  readonly details?: ApiErrorDetails;
  readonly status?: number;
  readonly requestId?: string;

  constructor({ message, details, status, requestId }: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.details = details;
    this.status = status;
    this.requestId = requestId;
  }
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiQueryPrimitive(value: unknown): value is Exclude<ApiQueryPrimitive, undefined> {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function isJsonRecord(body: RequestBody): body is Record<string, unknown> {
  return (
    isRecord(body) &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer)
  );
}

function readPersistedAuthState(): AuthState {
  if (!isBrowser()) {
    return defaultAuthState;
  }

  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!value) {
      return defaultAuthState;
    }

    const parsed = JSON.parse(value) as Partial<AuthState>;

    return {
      accessToken: typeof parsed.accessToken === 'string' ? parsed.accessToken : null,
      refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null,
      user: isRecord(parsed.user) ? (parsed.user as User) : null
    };
  } catch {
    return defaultAuthState;
  }
}

function persistAuthState(state: AuthState) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

function clearPersistedAuthState() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function buildUrl(path: string, params?: ApiQueryParams) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`, 'http://localhost');

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (isApiQueryPrimitive(item)) {
            url.searchParams.append(key, String(item));
          }
        }

        continue;
      }

      if (isApiQueryPrimitive(value)) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ''}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractRequestId(payload: unknown): string | undefined {
  if (!isRecord(payload)) {
    return undefined;
  }

  const meta = payload.meta;

  if (!isRecord(meta)) {
    return undefined;
  }

  return typeof meta.requestId === 'string' ? meta.requestId : undefined;
}

function normalizeApiError(payload: unknown, status: number, fallbackMessage = 'Request failed'): ApiClientError {
  if (isRecord(payload)) {
    const error = payload.error;

    if (isRecord(error) && typeof error.message === 'string') {
      return new ApiClientError({
        message: error.message,
        details: isRecord(error.details) ? error.details : undefined,
        status,
        requestId: extractRequestId(payload)
      });
    }

    if (typeof payload.message === 'string') {
      return new ApiClientError({
        message: payload.message,
        details: isRecord(payload.details) ? payload.details : undefined,
        status,
        requestId: extractRequestId(payload)
      });
    }
  }

  return new ApiClientError({
    message: fallbackMessage,
    status
  });
}

function unwrapData<TData>(payload: unknown): TData {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as TData;
  }

  return payload as TData;
}

function toBody(body: RequestBody): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams) {
    return body;
  }

  if (body instanceof Blob) {
    return body;
  }

  if (body instanceof ArrayBuffer) {
    return body;
  }

  return JSON.stringify(body);
}

function getStoredRefreshToken() {
  hydrateAuthStore();
  return authStore.getState().refreshToken;
}

function normalizeRefreshPayload(payload: unknown, currentRefreshToken: string): RefreshTokenPayload | null {
  if (!isRecord(payload)) {
    return null;
  }

  const candidate = isRecord(payload.data) ? payload.data : payload;
  const accessToken = candidate.accessToken;

  if (typeof accessToken !== 'string') {
    return null;
  }

  return {
    accessToken,
    refreshToken: typeof candidate.refreshToken === 'string' ? candidate.refreshToken : currentRefreshToken,
    expiresIn: typeof candidate.expiresIn === 'number' ? candidate.expiresIn : undefined
  };
}

async function requestTokenRefresh(refreshToken: string) {
  for (const path of REFRESH_PATHS) {
    const response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
      cache: 'no-store'
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      continue;
    }

    const refreshed = normalizeRefreshPayload(payload, refreshToken);

    if (refreshed) {
      return refreshed;
    }
  }

  return null;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        clearAuth();
        return null;
      }

      const refreshed = await requestTokenRefresh(refreshToken);

      if (!refreshed) {
        clearAuth();
        return null;
      }

      setAuth({
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken
      });

      return refreshed.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export function hydrateAuthStore() {
  const current = authStore.getState();

  if (current.hydrated) {
    return current;
  }

  const persisted = readPersistedAuthState();
  const nextState = {
    ...persisted,
    hydrated: true
  };

  authStore.setState(nextState);
  return nextState;
}

export function getAuthState() {
  return hydrateAuthStore();
}

export function setAuth(input: SetAuthInput) {
  const current = hydrateAuthStore();
  const nextState: AuthStoreState = {
    accessToken: input.accessToken ?? current.accessToken,
    refreshToken: input.refreshToken ?? current.refreshToken,
    user: input.user ?? current.user,
    hydrated: true
  };

  authStore.setState(nextState);
  persistAuthState(nextState);

  return nextState;
}

export function clearAuth() {
  const nextState: AuthStoreState = {
    ...defaultAuthState,
    hydrated: true
  };

  authStore.setState(nextState);
  clearPersistedAuthState();

  return nextState;
}

export function useApiAuthStore<T>(selector: (state: AuthStoreState) => T) {
  return useStore(authStore, selector);
}

export async function apiRequest<TResponse, TData = TResponse extends ApiEnvelope<infer TPayload> ? TPayload : TResponse, TBody = never>(
  options: RequestOptions<TBody>
) {
  hydrateAuthStore();

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (!options.skipAuth) {
    const accessToken = authStore.getState().accessToken;

    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const body = toBody(options.body as RequestBody);

  if (body && isJsonRecord(options.body as RequestBody) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(options.path, options.params), {
    method: options.method,
    headers,
    body,
    signal: options.signal,
    credentials: 'include',
    cache: 'no-store'
  });

  if (response.status === 401 && options.retryOnAuthError !== false && !options.skipAuth) {
    const refreshedAccessToken = await refreshAccessToken();

    if (refreshedAccessToken) {
      return apiRequest<TResponse, TData, TBody>({
        ...options,
        retryOnAuthError: false
      });
    }
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw normalizeApiError(
      payload,
      response.status,
      response.statusText || 'Request failed'
    );
  }

  return unwrapData<TData>(payload);
}

export const apiClient = {
  get<TResponse, TData = TResponse extends ApiEnvelope<infer TPayload> ? TPayload : TResponse>(
    path: string,
    options?: Omit<RequestOptions<never>, 'method' | 'path' | 'body'>
  ) {
    return apiRequest<TResponse, TData>({
      ...options,
      method: 'GET',
      path
    });
  },
  post<TResponse, TBody, TData = TResponse extends ApiEnvelope<infer TPayload> ? TPayload : TResponse>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody>, 'method' | 'path' | 'body'>
  ) {
    return apiRequest<TResponse, TData, TBody>({
      ...options,
      method: 'POST',
      path,
      body
    });
  },
  patch<TResponse, TBody, TData = TResponse extends ApiEnvelope<infer TPayload> ? TPayload : TResponse>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody>, 'method' | 'path' | 'body'>
  ) {
    return apiRequest<TResponse, TData, TBody>({
      ...options,
      method: 'PATCH',
      path,
      body
    });
  },
  put<TResponse, TBody, TData = TResponse extends ApiEnvelope<infer TPayload> ? TPayload : TResponse>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody>, 'method' | 'path' | 'body'>
  ) {
    return apiRequest<TResponse, TData, TBody>({
      ...options,
      method: 'PUT',
      path,
      body
    });
  },
  delete<TResponse, TData = TResponse extends ApiEnvelope<infer TPayload> ? TPayload : TResponse>(
    path: string,
    options?: Omit<RequestOptions<never>, 'method' | 'path' | 'body'>
  ) {
    return apiRequest<TResponse, TData>({
      ...options,
      method: 'DELETE',
      path
    });
  }
};

export function createApiQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
          if (error instanceof ApiClientError && error.status !== undefined && error.status < 500) {
            return false;
          }

          return failureCount < 2;
        }
      },
      mutations: {
        retry: 0
      }
    }
  });

  queryClient.setQueryDefaults(['products'], {
    staleTime: 60_000
  });
  queryClient.setQueryDefaults(['product'], {
    staleTime: 60_000
  });
  queryClient.setQueryDefaults(['vendors'], {
    staleTime: 120_000
  });
  queryClient.setQueryDefaults(['vendor'], {
    staleTime: 120_000
  });
  queryClient.setQueryDefaults(['cart'], {
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000
  });

  return queryClient;
}

if (isBrowser()) {
  hydrateAuthStore();
}
