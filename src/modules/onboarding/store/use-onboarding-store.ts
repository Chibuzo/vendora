'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Session } from '@/lib/auth';
import type { OnboardingRole, OnboardingSnapshot } from '@/modules/onboarding/lib/onboarding';

interface OnboardingState extends OnboardingSnapshot {
  activeUserId: string | null;
  fullName: string;
  businessName: string;
  businessCategory: string;
  city: string;
  region: string;
  verificationNotes: string;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  initializeForSession: (session: Session | null) => void;
  completeProfile: (payload: { fullName: string }) => void;
  confirmRole: (role: OnboardingRole) => void;
  completeVendorSetup: (payload: { businessName: string; businessCategory: string }) => void;
  completeLocation: (payload: { city: string; region: string }) => void;
  submitVerification: (payload: { verificationNotes: string }) => void;
  reset: () => void;
}

const initialState: Omit<
  OnboardingState,
  | 'setHasHydrated'
  | 'initializeForSession'
  | 'completeProfile'
  | 'confirmRole'
  | 'completeVendorSetup'
  | 'completeLocation'
  | 'submitVerification'
  | 'reset'
> = {
  activeUserId: null,
  profileCompleted: false,
  selectedRole: null,
  vendorSetupCompleted: false,
  locationAdded: false,
  verificationSubmitted: false,
  fullName: '',
  businessName: '',
  businessCategory: '',
  city: '',
  region: '',
  verificationNotes: '',
  hasHydrated: false
};

function getSessionDraft(session: Session) {
  return {
    activeUserId: session.user.id,
    fullName: session.user.name,
    selectedRole: null as OnboardingRole | null,
    profileCompleted: false,
    vendorSetupCompleted: false,
    locationAdded: false,
    verificationSubmitted: false,
    businessName: '',
    businessCategory: '',
    city: '',
    region: '',
    verificationNotes: ''
  };
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      initializeForSession: (session) => {
        if (!session) {
          set({ activeUserId: null });
          return;
        }

        const current = get();

        if (current.activeUserId === session.user.id) {
          return;
        }

        set(getSessionDraft(session));
      },
      completeProfile: ({ fullName }) =>
        set({
          profileCompleted: true,
          fullName
        }),
      confirmRole: (role) =>
        set({
          selectedRole: role,
          vendorSetupCompleted: role === 'buyer' ? true : get().vendorSetupCompleted,
          locationAdded: role === 'buyer' ? true : get().locationAdded,
          verificationSubmitted: role === 'buyer' ? true : get().verificationSubmitted
        }),
      completeVendorSetup: ({ businessName, businessCategory }) =>
        set({
          selectedRole: 'vendor',
          vendorSetupCompleted: true,
          businessName,
          businessCategory
        }),
      completeLocation: ({ city, region }) =>
        set({
          locationAdded: true,
          city,
          region
        }),
      submitVerification: ({ verificationNotes }) =>
        set({
          selectedRole: 'vendor',
          verificationSubmitted: true,
          verificationNotes
        }),
      reset: () => set(initialState)
    }),
    {
      name: 'vendora.onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeUserId: state.activeUserId,
        profileCompleted: state.profileCompleted,
        selectedRole: state.selectedRole,
        vendorSetupCompleted: state.vendorSetupCompleted,
        locationAdded: state.locationAdded,
        verificationSubmitted: state.verificationSubmitted,
        fullName: state.fullName,
        businessName: state.businessName,
        businessCategory: state.businessCategory,
        city: state.city,
        region: state.region,
        verificationNotes: state.verificationNotes
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function selectOnboardingSnapshot(state: OnboardingState): OnboardingSnapshot {
  return {
    profileCompleted: state.profileCompleted,
    selectedRole: state.selectedRole,
    vendorSetupCompleted: state.vendorSetupCompleted,
    locationAdded: state.locationAdded,
    verificationSubmitted: state.verificationSubmitted
  };
}

export function createSessionOnboardingSnapshot(session: Session | null): OnboardingSnapshot {
  if (!session) {
    return {
      profileCompleted: false,
      selectedRole: null,
      vendorSetupCompleted: false,
      locationAdded: false,
      verificationSubmitted: false
    };
  }

  return {
    profileCompleted: false,
    selectedRole: null,
    vendorSetupCompleted: false,
    locationAdded: false,
    verificationSubmitted: false
  };
}
