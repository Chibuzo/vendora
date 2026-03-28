import type {
  AuthSession,
  AuthSessionResponse,
  AuthTokens,
  AuthTokensResponse,
  Empty,
  EmptyResponse,
  OtpChallenge,
  OtpChallengeResponse,
  User,
  UserResponse
} from '@/shared/api/generated/model';

import { apiClient, clearAuth, getAuthState, setAuth } from '../client';
import type {
  LoginEmailInput,
  LoginPhoneSendOtpInput,
  LoginPhoneVerifyInput,
  SignupCompleteInput,
  SignupEmailInput,
  SignupPhoneSendOtpInput,
  SignupPhoneVerifyInput
} from '../types';

function syncSession(session: AuthSession) {
  setAuth({
    accessToken: session.tokens.accessToken,
    refreshToken: session.tokens.refreshToken,
    user: session.user
  });

  return session;
}

export async function signupEmail(data: SignupEmailInput) {
  const session = await apiClient.post<AuthSessionResponse, SignupEmailInput, AuthSession>(
    '/auth/signup/email',
    data,
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );

  return syncSession(session);
}

export function signupPhoneSendOtp(data: SignupPhoneSendOtpInput) {
  return apiClient.post<OtpChallengeResponse, SignupPhoneSendOtpInput, OtpChallenge>(
    '/auth/signup/phone/send-otp',
    data,
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );
}

export async function signupPhoneVerify(data: SignupPhoneVerifyInput) {
  const session = await apiClient.post<AuthSessionResponse, SignupPhoneVerifyInput, AuthSession>(
    '/auth/signup/phone/verify',
    data,
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );

  return syncSession(session);
}

export async function completeSignup(data: SignupCompleteInput) {
  const user = await apiClient.post<UserResponse, SignupCompleteInput, User>(
    '/auth/signup/complete',
    data
  );
  const authState = getAuthState();

  setAuth({
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    user
  });

  return user;
}

export async function loginEmail(data: LoginEmailInput) {
  const session = await apiClient.post<AuthSessionResponse, LoginEmailInput, AuthSession>(
    '/auth/login/email',
    data,
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );

  return syncSession(session);
}

export function loginPhoneSendOtp(data: LoginPhoneSendOtpInput) {
  return apiClient.post<OtpChallengeResponse, LoginPhoneSendOtpInput, OtpChallenge>(
    '/auth/login/phone/send-otp',
    data,
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );
}

export async function loginPhoneVerify(data: LoginPhoneVerifyInput) {
  const session = await apiClient.post<AuthSessionResponse, LoginPhoneVerifyInput, AuthSession>(
    '/auth/login/phone/verify',
    data,
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );

  return syncSession(session);
}

export async function refreshToken() {
  const authState = getAuthState();

  if (!authState.refreshToken) {
    clearAuth();
    throw new Error('No refresh token available');
  }

  const tokens = await apiClient.post<AuthTokensResponse, { refreshToken: string }, AuthTokens>(
    '/auth/tokens/refresh',
    {
      refreshToken: authState.refreshToken
    },
    {
      skipAuth: true,
      retryOnAuthError: false
    }
  );

  setAuth({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: authState.user
  });

  return tokens;
}

export async function logout() {
  const authState = getAuthState();

  try {
    if (authState.refreshToken) {
      await apiClient.post<EmptyResponse, { refreshToken: string }, Empty>(
        '/auth/logout',
        {
          refreshToken: authState.refreshToken
        },
        {
          retryOnAuthError: false
        }
      );
    }
  } finally {
    clearAuth();
  }

  return {} satisfies Empty;
}

export async function getCurrentUser() {
  const user = await apiClient.get<UserResponse, User>('/users/me');

  setAuth({
    user
  });

  return user;
}
