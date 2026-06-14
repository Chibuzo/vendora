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

const onboardedDemoUserIds = new Set(['buyer_001', 'vendor_001']);

function getSessionDraft(session: Session) {
  const demoRole =
    session.user.role === 'buyer' || session.user.role === 'vendor'
      ? session.user.role
      : null;
  const isOnboardedDemoUser = onboardedDemoUserIds.has(session.user.id) && Boolean(demoRole);

  return {
    activeUserId: session.user.id,
    fullName: session.user.name,
    selectedRole: isOnboardedDemoUser ? demoRole : null,
    profileCompleted: isOnboardedDemoUser,
    vendorSetupCompleted: isOnboardedDemoUser,
    locationAdded: isOnboardedDemoUser,
    verificationSubmitted: isOnboardedDemoUser,
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
        const draft = getSessionDraft(session);

        if (current.activeUserId === session.user.id) {
          if (draft.profileCompleted && !current.profileCompleted) {
            set(draft);
          }

          return;
        }

        set(draft);
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

  if (onboardedDemoUserIds.has(session.user.id) && (session.user.role === 'buyer' || session.user.role === 'vendor')) {
    return {
      profileCompleted: true,
      selectedRole: session.user.role,
      vendorSetupCompleted: true,
      locationAdded: true,
      verificationSubmitted: true
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
