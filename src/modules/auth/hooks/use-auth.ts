'use client';

import { useMutation } from '@tanstack/react-query';

import { logout as logoutRequest } from '@/modules/auth/api/logout';
import { requestOtp as requestOtpRequest } from '@/modules/auth/api/request-otp';
import { login as loginRequest } from '@/modules/auth/api/login';
import { useAuthStore } from '@/modules/auth/store/use-auth-store';
import type { LoginInput, RequestOtpInput } from '@/modules/auth/types';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const requestOtpMutation = useMutation({
    mutationFn: async (payload: RequestOtpInput) => requestOtpRequest(payload)
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginInput) => {
      const response = await loginRequest(payload);
      setSession(response.session);
      return response.session;
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => logoutRequest(),
    onSettled: () => {
      clearSession();
    }
  });

  return {
    session,
    isHydrated,
    isAuthenticated: Boolean(session),
    requestOtp: requestOtpMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isRequestOtpPending: requestOtpMutation.isPending,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    requestOtpError: requestOtpMutation.error,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error
  };
}
