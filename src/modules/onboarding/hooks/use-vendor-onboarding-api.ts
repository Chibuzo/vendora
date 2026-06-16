'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/modules/auth/store/use-auth-store';

export type ApiUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
};

export type VendorOnboardingVendor = {
  id: string;
  businessName: string;
  description: string | null;
  phone: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  instagramUrl: string | null;
  whatsappNumber: string | null;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  onboardingCompleted: boolean;
  status: string;
};

export type VendorOnboardingResponse = {
  activationStatus: string;
  vendor: VendorOnboardingVendor;
};

export interface CreateVendorInput {
  businessName: string;
  phone: string;
  description?: string;
  whatsappNumber?: string;
}

export interface CreateVendorLocationInput {
  state: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateVendorStorefrontInput {
  logoUrl: string | null;
  bannerUrl: string | null;
  instagramUrl: string | null;
}

export interface CreateVendorProductInput {
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  stockQuantity?: number;
  description?: string;
}

export interface CompleteVendorOnboardingInput {
  onboardingCompleted: true;
}

export interface SubmitVendorVerificationInput {
  cacNumber: string;
}

const onboardingKeys = {
  currentUser: ['onboarding', 'current-user'] as const,
  vendor: ['onboarding', 'vendor'] as const
};

function sessionFromApiUser(
  session: NonNullable<ReturnType<typeof useAuthStore.getState>['session']>,
  user: ApiUser
) {
  return {
    ...session,
    user: {
      ...session.user,
      id: user.id,
      name: user.name || session.user.name,
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
      (
        await apiClient.post<VendorOnboardingResponse, CreateVendorInput>('/vendors', payload)
      ).data,
    onSuccess(data) {
      queryClient.setQueryData(onboardingKeys.vendor, data.vendor);
    }
  });
}

export function useCreateVendorLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVendorLocationInput) =>
      (
        await apiClient.post<VendorOnboardingResponse, CreateVendorLocationInput>(
          '/vendors/locations',
          payload
        )
      ).data,
    onSuccess(data) {
      queryClient.setQueryData(onboardingKeys.vendor, data.vendor);
    }
  });
}

export function useUpdateVendorStorefront() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateVendorStorefrontInput) =>
      (
        await apiClient.patch<VendorOnboardingVendor, UpdateVendorStorefrontInput>(
          '/vendors/me/storefront',
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
    mutationFn: async (payload: CreateVendorProductInput) =>
      (
        await apiClient.post<unknown, CreateVendorProductInput>(
          '/vendors/me/products',
          payload
        )
      ).data
  });
}

export function useCompleteVendorOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompleteVendorOnboardingInput) =>
      (
        await apiClient.patch<VendorOnboardingVendor, CompleteVendorOnboardingInput>(
          '/vendors/me/onboarding-status',
          payload
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
    mutationFn: async (payload: SubmitVendorVerificationInput) =>
      (
        await apiClient.post<VendorOnboardingVendor, SubmitVendorVerificationInput>(
          '/vendors/verify',
          payload
        )
      ).data,
    onSuccess(vendor) {
      queryClient.setQueryData(onboardingKeys.vendor, vendor);
    }
  });
}
