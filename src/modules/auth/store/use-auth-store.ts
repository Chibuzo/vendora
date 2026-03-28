'use client';

import { create } from 'zustand';

import type { Session } from '@/lib/auth';

interface AuthState {
  session: Session | null;
  isHydrated: boolean;
  setSession: (session: Session) => void;
  setHydrated: (value: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isHydrated: false,
  setSession: (session) => set({ session }),
  setHydrated: (value) => set({ isHydrated: value }),
  clearSession: () => set({ session: null })
}));
