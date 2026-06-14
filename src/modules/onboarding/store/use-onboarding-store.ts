'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Session } from '@/lib/auth';
import type { OnboardingRole, OnboardingSnapshot } from '@/modules/onboarding/lib/onboarding';

interface OnboardingState extends OnboardingSnapshot {
  activeUserId: string | null;
  businessName: string;
  businessCategory: string;
  city: string;
  region: string;
  verificationNotes: string;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  initializeForSession: (session: Session | null) => void;
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
  | 'confirmRole'
  | 'completeVendorSetup'
  | 'completeLocation'
  | 'submitVerification'
  | 'reset'
> = {
  activeUserId: null,
  selectedRole: null,
  vendorSetupCompleted: false,
  locationAdded: false,
  verificationSubmitted: false,
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
    selectedRole: isOnboardedDemoUser ? demoRole : null,
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
          return;
        }

        set(draft);
      },
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
        selectedRole: state.selectedRole,
        vendorSetupCompleted: state.vendorSetupCompleted,
        locationAdded: state.locationAdded,
        verificationSubmitted: state.verificationSubmitted,
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
    selectedRole: state.selectedRole,
    vendorSetupCompleted: state.vendorSetupCompleted,
    locationAdded: state.locationAdded,
    verificationSubmitted: state.verificationSubmitted
  };
}

export function createSessionOnboardingSnapshot(session: Session | null): OnboardingSnapshot {
  if (!session) {
    return {
      selectedRole: null,
      vendorSetupCompleted: false,
      locationAdded: false,
      verificationSubmitted: false
    };
  }

  if (onboardedDemoUserIds.has(session.user.id) && (session.user.role === 'buyer' || session.user.role === 'vendor')) {
    return {
      selectedRole: session.user.role,
      vendorSetupCompleted: true,
      locationAdded: true,
      verificationSubmitted: true
    };
  }

  return {
    selectedRole: null,
    vendorSetupCompleted: false,
    locationAdded: false,
    verificationSubmitted: false
  };
}

export interface VendorOnboardingState {
  vendorId: string;
  businessName: string;
  businessCategory: string;
  phone: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  firstProductName: string;
  firstProductCategory: string;
  firstProductPrice: number;
  firstProductImageUrl: string;
  firstProductStockQuantity: number;
  firstProductDescription: string;

  saveBusinessDraft: (payload: Partial<VendorOnboardingState>) => void;
  completeBusinessProfile: (payload: Partial<VendorOnboardingState>) => void;
  saveStorefrontDraft: (payload: Partial<VendorOnboardingState>) => void;
  completeStorefront: (payload: Partial<VendorOnboardingState>) => void;
  saveFirstProductDraft: (payload: Partial<VendorOnboardingState>) => void;
  completeFirstProduct: (payload: Partial<VendorOnboardingState>) => void;
  completeOnboarding: () => void;
}

const initialVendorState = {
  vendorId: '',
  businessName: '',
  businessCategory: '',
  phone: '',
  description: '',
  logoUrl: '',
  bannerUrl: '',
  instagramUrl: '',
  whatsappUrl: '',
  firstProductName: '',
  firstProductCategory: '',
  firstProductPrice: 0,
  firstProductImageUrl: '',
  firstProductStockQuantity: 0,
  firstProductDescription: ''
};

export const useVendorOnboardingStore = create<VendorOnboardingState>()(
  persist(
    (set) => ({
      ...initialVendorState,
      saveBusinessDraft: (payload) => set((state) => ({ ...state, ...payload })),
      completeBusinessProfile: (payload) => set((state) => ({ ...state, ...payload })),
      saveStorefrontDraft: (payload) => set((state) => ({ ...state, ...payload })),
      completeStorefront: (payload) => set((state) => ({ ...state, ...payload })),
      saveFirstProductDraft: (payload) => set((state) => ({ ...state, ...payload })),
      completeFirstProduct: (payload) => set((state) => ({ ...state, ...payload })),
      completeOnboarding: () => set(initialVendorState)
    }),
    {
      name: 'vendora.vendor-onboarding',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

