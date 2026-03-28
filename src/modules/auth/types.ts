import type { Session } from '@/lib/auth';

export interface RequestOtpInput {
  identifier: string;
}

export interface OtpChallenge {
  challengeId: string;
  channel: 'email' | 'sms';
  maskedDestination: string;
  expiresAt: string;
  resendAvailableAt: string;
}

export interface RequestOtpResponse {
  challenge: OtpChallenge;
}

export interface LoginInput extends RequestOtpInput {
  challengeId: string;
  otp: string;
}

export interface LoginResponse {
  session: Session;
}

export interface SessionResponse {
  session: Session | null;
}

export interface LogoutResponse {
  success: boolean;
}
