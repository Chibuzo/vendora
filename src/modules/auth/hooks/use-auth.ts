'use client';

import { useMutation } from '@tanstack/react-query';

import { login as loginRequest } from '@/modules/auth/api/login';
import { useAuthStore } from '@/modules/auth/store/use-auth-store';
import type { LoginInput } from '@/modules/auth/types';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const mutation = useMutation({
    mutationFn: async (payload: LoginInput) => {
      const response = await loginRequest(payload);
      setSession(response.session);
      return response.session;
    }
  });

  return {
    session,
    isAuthenticated: Boolean(session),
    login: mutation.mutateAsync,
    logout: clearSession,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
