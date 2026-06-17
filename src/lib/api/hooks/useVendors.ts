'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions
} from '@tanstack/react-query';

import { ApiClientError } from '../client';
import {
  addVendorLocation,
  createVendor,
  getCurrentVendor,
  getPopularVendors,
  getSimilarVendors,
  getVendorById,
  getVendorBySlug,
  getVendorOnboardingStatus,
  getVendorReviews,
  getVendorTrust,
  getVendors,
  submitVendorVerification,
  updateVendor,
  getVendorDashboardSummary,
  getVendorDashboardRevenue,
  getVendorDashboardOrders,
  getVendorDashboardTopProducts,
  getVendorPayouts,
  requestVendorPayout,
  getCurrentVendorBalance
} from '../endpoints/vendors';
import type {
  AddVendorLocationInput,
  CreateVendorInput,
  SimilarVendorsParams,
  SubmitVendorVerificationInput,
  UpdateVendorInput,
  Vendor,
  VendorListData,
  VendorOnboardingStatus,
  VendorRecommendationResponseData,
  VendorRecommendationsParams,
  VendorReviewListData,
  VendorReviewsParams,
  VendorsListParams,
  VendorTrustSummary,
  VendorAnalyticsSummary,
  VendorAnalyticsRevenueResponseData,
  VendorAnalyticsOrdersResponseData,
  VendorAnalyticsTopProductsResponseData,
  VendorDashboardOrdersParams,
  VendorDashboardRevenueParams,
  VendorDashboardTopProductsParams,
  VendorPayoutListData,
  VendorPayoutsParams,
  TriggerVendorPayoutInput,
  Payout,
  VendorBalance
} from '../types';

type QueryOptions<TResult, TKey extends QueryKey> = Omit<
  UseQueryOptions<TResult, ApiClientError, TResult, TKey>,
  'queryFn' | 'queryKey'
>;

type MutationOptions<TResult, TVariables, TOnMutateResult = unknown> = Omit<
  UseMutationOptions<TResult, ApiClientError, TVariables, TOnMutateResult>,
  'mutationFn' | 'mutationKey'
>;

export const vendorKeys = {
  root: ['vendors'] as const,
  lists: (params?: VendorsListParams) => ['vendors', params ?? null] as const,
  current: ['vendors', 'current'] as const,
  onboarding: ['vendors', 'onboarding'] as const,
  detail: (id: string) => ['vendor', id] as const,
  slug: (slug: string) => ['vendor', 'slug', slug] as const,
  popular: (params?: VendorRecommendationsParams) => ['vendors', 'popular', params ?? null] as const,
  similar: (id: string, params?: SimilarVendorsParams) =>
    ['vendors', 'similar', id, params ?? null] as const,
  reviews: (id: string, params?: VendorReviewsParams) =>
    ['vendors', 'reviews', id, params ?? null] as const,
  trust: (id: string) => ['vendors', 'trust', id] as const,
  dashboardSummary: ['vendors', 'dashboard', 'summary'] as const,
  dashboardRevenue: (params?: VendorDashboardRevenueParams) => ['vendors', 'dashboard', 'revenue', params ?? null] as const,
  dashboardOrders: (params?: VendorDashboardOrdersParams) => ['vendors', 'dashboard', 'orders', params ?? null] as const,
  dashboardTopProducts: (params?: VendorDashboardTopProductsParams) => ['vendors', 'dashboard', 'topProducts', params ?? null] as const,
  payouts: (params?: VendorPayoutsParams) => ['vendors', 'payouts', params ?? null] as const,
  balance: ['vendors', 'balance'] as const
};

export function useVendors(
  params?: VendorsListParams,
  options?: QueryOptions<VendorListData, ReturnType<typeof vendorKeys.lists>>
) {
  return useQuery({
    queryKey: vendorKeys.lists(params),
    queryFn: () => getVendors(params),
    staleTime: 120_000,
    ...options
  });
}

export function useVendor(id: string, options?: QueryOptions<Vendor, ReturnType<typeof vendorKeys.detail>>) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => getVendorById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 120_000,
    ...options
  });
}

export function useVendorBySlug(
  slug: string,
  options?: QueryOptions<Vendor, ReturnType<typeof vendorKeys.slug>>
) {
  return useQuery({
    queryKey: vendorKeys.slug(slug),
    queryFn: () => getVendorBySlug(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 120_000,
    ...options
  });
}

export function useCurrentVendor(options?: QueryOptions<Vendor, typeof vendorKeys.current>) {
  return useQuery({
    queryKey: vendorKeys.current,
    queryFn: getCurrentVendor,
    ...options
  });
}

export function useVendorOnboardingStatus(
  options?: QueryOptions<VendorOnboardingStatus, typeof vendorKeys.onboarding>
) {
  return useQuery({
    queryKey: vendorKeys.onboarding,
    queryFn: getVendorOnboardingStatus,
    ...options
  });
}

export function usePopularVendors(
  params: VendorRecommendationsParams,
  options?: QueryOptions<VendorRecommendationResponseData, ReturnType<typeof vendorKeys.popular>>
) {
  return useQuery({
    queryKey: vendorKeys.popular(params),
    queryFn: () => getPopularVendors(params),
    staleTime: 120_000,
    ...options
  });
}

export function useSimilarVendors(
  id: string,
  params?: SimilarVendorsParams,
  options?: QueryOptions<VendorRecommendationResponseData, ReturnType<typeof vendorKeys.similar>>
) {
  return useQuery({
    queryKey: vendorKeys.similar(id, params),
    queryFn: () => getSimilarVendors(id, params),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 120_000,
    ...options
  });
}

export function useVendorReviews(
  id: string,
  params?: VendorReviewsParams,
  options?: QueryOptions<VendorReviewListData, ReturnType<typeof vendorKeys.reviews>>
) {
  return useQuery({
    queryKey: vendorKeys.reviews(id, params),
    queryFn: () => getVendorReviews(id, params),
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options
  });
}

export function useVendorTrust(
  id: string,
  options?: QueryOptions<VendorTrustSummary, ReturnType<typeof vendorKeys.trust>>
) {
  return useQuery({
    queryKey: vendorKeys.trust(id),
    queryFn: () => getVendorTrust(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 120_000,
    ...options
  });
}

export function useCreateVendor(options?: MutationOptions<Vendor, CreateVendorInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Vendor, ApiClientError, CreateVendorInput>({
    mutationKey: [...vendorKeys.root, 'create'],
    mutationFn: createVendor,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(vendorKeys.current, data);
      void queryClient.invalidateQueries({
        queryKey: vendorKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useUpdateVendor(options?: MutationOptions<Vendor, UpdateVendorInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Vendor, ApiClientError, UpdateVendorInput>({
    mutationKey: [...vendorKeys.root, 'update'],
    mutationFn: updateVendor,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(vendorKeys.current, data);
      queryClient.setQueryData(vendorKeys.detail(data.id), data);
      queryClient.setQueryData(vendorKeys.slug(data.slug), data);
      void queryClient.invalidateQueries({
        queryKey: vendorKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useAddVendorLocation(options?: MutationOptions<Vendor, AddVendorLocationInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Vendor, ApiClientError, AddVendorLocationInput>({
    mutationKey: [...vendorKeys.root, 'location', 'add'],
    mutationFn: addVendorLocation,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(vendorKeys.current, data);
      void queryClient.invalidateQueries({
        queryKey: vendorKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useSubmitVendorVerification(
  options?: MutationOptions<Vendor, SubmitVendorVerificationInput>
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Vendor, ApiClientError, SubmitVendorVerificationInput>({
    mutationKey: [...vendorKeys.root, 'verification', 'submit'],
    mutationFn: submitVendorVerification,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(vendorKeys.current, data);
      void queryClient.invalidateQueries({
        queryKey: vendorKeys.root
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useVendorDashboardSummary(
  options?: QueryOptions<VendorAnalyticsSummary, typeof vendorKeys.dashboardSummary>
) {
  return useQuery({
    queryKey: vendorKeys.dashboardSummary,
    queryFn: getVendorDashboardSummary,
    ...options
  });
}

export function useVendorDashboardRevenue(
  params?: VendorDashboardRevenueParams,
  options?: QueryOptions<VendorAnalyticsRevenueResponseData, ReturnType<typeof vendorKeys.dashboardRevenue>>
) {
  return useQuery({
    queryKey: vendorKeys.dashboardRevenue(params),
    queryFn: () => getVendorDashboardRevenue(params),
    ...options
  });
}

export function useVendorDashboardOrders(
  params?: VendorDashboardOrdersParams,
  options?: QueryOptions<VendorAnalyticsOrdersResponseData, ReturnType<typeof vendorKeys.dashboardOrders>>
) {
  return useQuery({
    queryKey: vendorKeys.dashboardOrders(params),
    queryFn: () => getVendorDashboardOrders(params),
    ...options
  });
}

export function useVendorDashboardTopProducts(
  params?: VendorDashboardTopProductsParams,
  options?: QueryOptions<VendorAnalyticsTopProductsResponseData, ReturnType<typeof vendorKeys.dashboardTopProducts>>
) {
  return useQuery({
    queryKey: vendorKeys.dashboardTopProducts(params),
    queryFn: () => getVendorDashboardTopProducts(params),
    ...options
  });
}

export function useCurrentVendorBalance(
  options?: QueryOptions<VendorBalance, typeof vendorKeys.balance>
) {
  return useQuery({
    queryKey: vendorKeys.balance,
    queryFn: getCurrentVendorBalance,
    ...options
  });
}


export function useVendorPayouts(
  params?: VendorPayoutsParams,
  options?: QueryOptions<VendorPayoutListData, ReturnType<typeof vendorKeys.payouts>>
) {
  return useQuery({
    queryKey: vendorKeys.payouts(params),
    queryFn: () => getVendorPayouts(params),
    ...options
  });
}

export function useRequestVendorPayout(options?: MutationOptions<Payout, TriggerVendorPayoutInput>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Payout, ApiClientError, TriggerVendorPayoutInput>({
    mutationKey: [...vendorKeys.root, 'payout', 'request'],
    mutationFn: requestVendorPayout,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      void queryClient.invalidateQueries({
        queryKey: ['vendors', 'payouts']
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}
