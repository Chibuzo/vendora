'use client';

import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { Session } from '@/lib/auth';
import { logout as logoutRequest } from '@/modules/auth/api/logout';
import { useAuthStore } from '@/modules/auth/store/use-auth-store';
import type { LoginResponse, OtpChallenge } from '@/modules/auth/types';

type EmailAuthPayload = {
  email: string;
  password: string;
  fullName?: string;
};

type PhoneSendPayload = {
  phone: string;
};

type PhoneVerifyPayload = {
  phone: string;
  challengeId: string;
  otp: string;
};

type CompleteSignupPayload = {
  fullName: string;
  role?: 'buyer' | 'vendor';
};

type ApiUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  fullName: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
};

function sessionFromApiUser(session: Session, user: ApiUser): Session {
  return {
    ...session,
    user: {
      ...session.user,
      name: user.fullName,
      role: user.role.toLowerCase() as Session['user']['role'],
      email: user.email ?? session.user.email
    }
  };
}

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const signupEmailMutation = useMutation({
    mutationFn: async (payload: EmailAuthPayload) => {
      const response = await apiClient.post<LoginResponse, EmailAuthPayload>('/auth/signup/email', payload);
      setSession(response.data.session);
      return response.data.session;
    }
  });

  const signupPhoneSendOtpMutation = useMutation({
    mutationFn: async (payload: PhoneSendPayload) => {
      const response = await apiClient.post<{ challenge: OtpChallenge }, PhoneSendPayload>(
        '/auth/signup/phone/send-otp',
        payload
      );
      return response.data.challenge;
    }
  });

  const signupPhoneVerifyMutation = useMutation({
    mutationFn: async (payload: PhoneVerifyPayload) => {
      const response = await apiClient.post<LoginResponse, PhoneVerifyPayload>(
        '/auth/signup/phone/verify',
        payload
      );
      setSession(response.data.session);
      return response.data.session;
    }
  });

  const loginEmailMutation = useMutation({
    mutationFn: async (payload: EmailAuthPayload) => {
      const response = await apiClient.post<LoginResponse, EmailAuthPayload>('/auth/login/email', payload);
      setSession(response.data.session);
      return response.data.session;
    }
  });

  const loginPhoneSendOtpMutation = useMutation({
    mutationFn: async (payload: PhoneSendPayload) => {
      const response = await apiClient.post<{ challenge: OtpChallenge }, PhoneSendPayload>(
        '/auth/login/phone/send-otp',
        payload
      );
      return response.data.challenge;
    }
  });

  const loginPhoneVerifyMutation = useMutation({
    mutationFn: async (payload: PhoneVerifyPayload) => {
      const response = await apiClient.post<LoginResponse, PhoneVerifyPayload>(
        '/auth/login/phone/verify',
        payload
      );
      setSession(response.data.session);
      return response.data.session;
    }
  });

  const completeSignupMutation = useMutation({
    mutationFn: async (payload: CompleteSignupPayload) => {
      const response = await apiClient.post<ApiUser, CompleteSignupPayload>('/auth/signup/complete', payload);

      if (session) {
        setSession(sessionFromApiUser(session, response.data));
      }

      return response.data;
    }
  });

  const fetchMeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.get<ApiUser>('/auth/me');

      if (session) {
        setSession(sessionFromApiUser(session, response.data));
      }

      return response.data;
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
    signupEmail: signupEmailMutation.mutateAsync,
    signupPhoneSendOtp: signupPhoneSendOtpMutation.mutateAsync,
    signupPhoneVerify: signupPhoneVerifyMutation.mutateAsync,
    loginEmail: loginEmailMutation.mutateAsync,
    loginPhoneSendOtp: loginPhoneSendOtpMutation.mutateAsync,
    loginPhoneVerify: loginPhoneVerifyMutation.mutateAsync,
    completeSignup: completeSignupMutation.mutateAsync,
    fetchMe: fetchMeMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isSignupEmailPending: signupEmailMutation.isPending,
    isSignupPhoneSendOtpPending: signupPhoneSendOtpMutation.isPending,
    isSignupPhoneVerifyPending: signupPhoneVerifyMutation.isPending,
    isLoginEmailPending: loginEmailMutation.isPending,
    isLoginPhoneSendOtpPending: loginPhoneSendOtpMutation.isPending,
    isLoginPhoneVerifyPending: loginPhoneVerifyMutation.isPending,
    isCompleteSignupPending: completeSignupMutation.isPending,
    isFetchMePending: fetchMeMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    signupEmailError: signupEmailMutation.error,
    signupPhoneError: signupPhoneSendOtpMutation.error ?? signupPhoneVerifyMutation.error,
    loginEmailError: loginEmailMutation.error,
    loginPhoneError: loginPhoneSendOtpMutation.error ?? loginPhoneVerifyMutation.error,
    completeSignupError: completeSignupMutation.error
  };
}
