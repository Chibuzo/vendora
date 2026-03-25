import type { Session } from '@/lib/auth';

export interface LoginInput {
  identifier: string;
  otp: string;
}

export interface LoginResponse {
  session: Session;
}
