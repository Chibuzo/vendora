export interface ApiMeta {
  requestId?: string;
  timestamp: string;
  tenant?: string | null;
}

export interface ApiError {
  code?: string;
  message: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: ApiMeta;
  error?: ApiError;
}
