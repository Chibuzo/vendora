'use client';

import { useEffect } from 'react';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { ApiClientError, clearAuth, hydrateAuthStore, setAuth, useApiAuthStore } from '../client';
import {
  completeSignup,
  loginEmail,
  loginPhoneSendOtp,
  loginPhoneVerify,
  logout,
  refreshToken,
  signupEmail,
  signupPhoneSendOtp,
  signupPhoneVerify
} from '../endpoints/auth';
import type {
  AuthSession,
  AuthTokens,
  LoginEmailInput,
  LoginPhoneSendOtpInput,
  LoginPhoneVerifyInput,
  OtpChallenge,
  SignupCompleteInput,
  SignupEmailInput,
  SignupPhoneSendOtpInput,
  SignupPhoneVerifyInput,
  User
} from '../types';

type MutationOptions<TResult, TVariables, TOnMutateResult = unknown> = Omit<
  UseMutationOptions<TResult, ApiClientError, TVariables, TOnMutateResult>,
  'mutationFn' | 'mutationKey'
>;

export const authKeys = {
  root: ['auth'] as const,
  currentUser: ['user', 'current'] as const
};

export function useAuth() {
  const authState = useApiAuthStore((state) => state);

  useEffect(() => {
    hydrateAuthStore();
  }, []);

  return {
    ...authState,
    isAuthenticated: Boolean(authState.accessToken),
    setAuth,
    clearAuth
  };
}

function invalidateCurrentUser(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: authKeys.currentUser
  });
}

export function useSignupEmail(options?: MutationOptions<AuthSession, SignupEmailInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthSession, ApiClientError, SignupEmailInput>({
    mutationKey: [...authKeys.root, 'signup', 'email'],
    mutationFn: signupEmail,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      void invalidateCurrentUser(queryClient);
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useSignupPhoneSendOtp(
  options?: MutationOptions<OtpChallenge, SignupPhoneSendOtpInput>
) {
  return useMutation<OtpChallenge, ApiClientError, SignupPhoneSendOtpInput>({
    mutationKey: [...authKeys.root, 'signup', 'phone', 'send-otp'],
    mutationFn: signupPhoneSendOtp,
    ...options
  });
}

export function useSignupPhoneVerify(options?: MutationOptions<AuthSession, SignupPhoneVerifyInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthSession, ApiClientError, SignupPhoneVerifyInput>({
    mutationKey: [...authKeys.root, 'signup', 'phone', 'verify'],
    mutationFn: signupPhoneVerify,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      void invalidateCurrentUser(queryClient);
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useCompleteSignup(options?: MutationOptions<User, SignupCompleteInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<User, ApiClientError, SignupCompleteInput>({
    mutationKey: [...authKeys.root, 'signup', 'complete'],
    mutationFn: completeSignup,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(authKeys.currentUser, data);
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useLoginEmail(options?: MutationOptions<AuthSession, LoginEmailInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthSession, ApiClientError, LoginEmailInput>({
    mutationKey: [...authKeys.root, 'login', 'email'],
    mutationFn: loginEmail,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(authKeys.currentUser, data.user);
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useLoginPhoneSendOtp(options?: MutationOptions<OtpChallenge, LoginPhoneSendOtpInput>) {
  return useMutation<OtpChallenge, ApiClientError, LoginPhoneSendOtpInput>({
    mutationKey: [...authKeys.root, 'login', 'phone', 'send-otp'],
    mutationFn: loginPhoneSendOtp,
    ...options
  });
}

export function useLoginPhoneVerify(options?: MutationOptions<AuthSession, LoginPhoneVerifyInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthSession, ApiClientError, LoginPhoneVerifyInput>({
    mutationKey: [...authKeys.root, 'login', 'phone', 'verify'],
    mutationFn: loginPhoneVerify,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(authKeys.currentUser, data.user);
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useRefreshToken(options?: MutationOptions<AuthTokens, void>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthTokens, ApiClientError, void>({
    mutationKey: [...authKeys.root, 'refresh'],
    mutationFn: refreshToken,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      void invalidateCurrentUser(queryClient);
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useLogout(options?: MutationOptions<Record<string, never>, void>) {
  const queryClient = useQueryClient();
  const { onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<Record<string, never>, ApiClientError, void>({
    mutationKey: [...authKeys.root, 'logout'],
    mutationFn: logout,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.clear();
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled(data, error, variables, onMutateResult, context) {
      queryClient.removeQueries();
      onSettled?.(data, error, variables, onMutateResult, context);
    }
  });
}
