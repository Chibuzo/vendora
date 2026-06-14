'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/modules/auth/store/use-auth-store';

export type ApiUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  fullName: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
};

export type VendorOnboardingVendor = {
  id: string;
  slug: string;
  businessName: string;
  description: string;
  phone: string;
  category: string;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  onboardingCompleted: boolean;
};

export interface CreateVendorInput {
  businessName: string;
  category: string;
  phone: string;
  description: string;
}

export interface CreateVendorLocationInput {
  vendorId: string;
  state: string;
  city: string;
  address: string;
}

export interface UpdateVendorStorefrontInput {
  vendorId: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
}

export interface CreateVendorProductInput {
  vendorId: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  description: string;
}

export interface CompleteVendorOnboardingInput {
  vendorId: string;
  onboardingCompleted: true;
}

export interface SubmitVendorVerificationInput {
  vendorId: string;
  cacNumber: string;
  governmentIdUrl: string;
  businessProofUrl: string;
  socialMediaUrl: string;
}

const onboardingKeys = {
  currentUser: ['onboarding', 'current-user'] as const,
  vendor: ['onboarding', 'vendor'] as const
};

function sessionFromApiUser(session: NonNullable<ReturnType<typeof useAuthStore.getState>['session']>, user: ApiUser) {
  return {
    ...session,
    user: {
      ...session.user,
      id: user.id,
      name: user.fullName || session.user.name,
      role: user.role.toLowerCase() as typeof session.user.role,
      email: user.email ?? session.user.email
    }
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: onboardingKeys.currentUser,
    queryFn: async () => (await apiClient.get<ApiUser>('/auth/me')).data
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: { role: 'BUYER' | 'VENDOR' }) =>
      (await apiClient.patch<ApiUser, typeof payload>('/users/me/role', payload)).data,
    onSuccess(user) {
      queryClient.setQueryData(onboardingKeys.currentUser, user);

      if (session) {
        setSession(sessionFromApiUser(session, user));
      }
    }
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVendorInput) =>
      (await apiClient.post<VendorOnboardingVendor, CreateVendorInput>('/vendors', payload)).data,
    onSuccess(vendor) {
      queryClient.setQueryData(onboardingKeys.vendor, vendor);
    }
  });
}

export function useCreateVendorLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, ...payload }: CreateVendorLocationInput) =>
      (
        await apiClient.post<VendorOnboardingVendor, Omit<CreateVendorLocationInput, 'vendorId'>>(
          `/vendors/${vendorId}/locations`,
          payload
        )
      ).data,
    onSuccess(vendor) {
      queryClient.setQueryData(onboardingKeys.vendor, vendor);
    }
  });
}

export function useUpdateVendorStorefront() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, ...payload }: UpdateVendorStorefrontInput) =>
      (
        await apiClient.patch<VendorOnboardingVendor, Omit<UpdateVendorStorefrontInput, 'vendorId'>>(
          `/vendors/${vendorId}/storefront`,
          payload
        )
      ).data,
    onSuccess(vendor) {
      queryClient.setQueryData(onboardingKeys.vendor, vendor);
    }
  });
}

export function useCreateVendorProduct() {
  return useMutation({
    mutationFn: async ({ vendorId, ...payload }: CreateVendorProductInput) =>
      (
        await apiClient.post<unknown, Omit<CreateVendorProductInput, 'vendorId'>>(
          `/vendors/${vendorId}/products`,
          payload
        )
      ).data
  });
}

export function useCompleteVendorOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, onboardingCompleted }: CompleteVendorOnboardingInput) =>
      (
        await apiClient.patch<VendorOnboardingVendor, { onboardingCompleted: true }>(
          `/vendors/${vendorId}/onboarding-status`,
          { onboardingCompleted }
        )
      ).data,
    onSuccess(vendor) {
      queryClient.setQueryData(onboardingKeys.vendor, vendor);
    }
  });
}

export function useSubmitVendorVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, ...payload }: SubmitVendorVerificationInput) =>
      (
        await apiClient.post<VendorOnboardingVendor, Omit<SubmitVendorVerificationInput, 'vendorId'>>(
          `/vendors/${vendorId}/verification`,
          payload
        )
      ).data,
    onSuccess(vendor) {
      queryClient.setQueryData(onboardingKeys.vendor, vendor);
    }
  });
}
