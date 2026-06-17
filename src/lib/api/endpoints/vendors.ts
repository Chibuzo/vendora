import type {
  Vendor,
  VendorOnboardingStatus,
  VendorOnboardingStatusResponse,
  VendorRecommendationResponse,
  VendorRecommendationResponseData,
  VendorResponse,
  VendorReviewListResponse,
  VendorTrustSummaryResponse,
  VendorAnalyticsSummaryResponse,
  VendorAnalyticsSummary,
  VendorAnalyticsRevenueResponse,
  VendorAnalyticsRevenueResponseData,
  VendorAnalyticsOrdersResponse,
  VendorAnalyticsOrdersResponseData,
  VendorAnalyticsTopProductsResponse,
  VendorAnalyticsTopProductsResponseData,
  VendorPayoutListResponse,
  VendorPayoutListData,
  PayoutResponse,
  Payout,
  VendorBalanceResponse,
  VendorBalance
} from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type {
  AddVendorLocationInput,
  CreateVendorInput,
  SimilarVendorsParams,
  SubmitVendorVerificationInput,
  VendorRecommendationsParams,
  VendorReviewsParams,
  VendorsListParams,
  VendorTrustSummary,
  UpdateVendorInput,
  VendorListData,
  VendorDashboardOrdersParams,
  VendorDashboardRevenueParams,
  VendorDashboardTopProductsParams,
  VendorPayoutsParams,
  TriggerVendorPayoutInput
} from '../types';

export function getVendors(params?: VendorsListParams) {
  return apiClient.get<import('@/shared/api/generated/model').VendorListResponse, VendorListData>(
    '/vendors',
    {
      params
    }
  );
}

export function getVendorById(id: string) {
  return apiClient.get<VendorResponse, Vendor>(`/vendors/${id}`);
}

export function getVendorBySlug(slug: string) {
  return apiClient.get<VendorResponse, Vendor>(`/vendors/slug/${slug}`);
}

export function createVendor(data: CreateVendorInput) {
  return apiClient.post<VendorResponse, CreateVendorInput, Vendor>('/vendors', data);
}

export function getCurrentVendor() {
  return apiClient.get<VendorResponse, Vendor>('/vendors/me');
}

export function updateVendor(data: UpdateVendorInput) {
  return apiClient.patch<VendorResponse, UpdateVendorInput, Vendor>('/vendors/me', data);
}

export function getVendorOnboardingStatus() {
  return apiClient.get<VendorOnboardingStatusResponse, VendorOnboardingStatus>(
    '/vendors/onboarding-status'
  );
}

export function addVendorLocation(data: AddVendorLocationInput) {
  return apiClient.post<
    VendorResponse,
    AddVendorLocationInput,
    Vendor
  >('/vendors/locations', data);
}

export function submitVendorVerification(data: SubmitVendorVerificationInput) {
  return apiClient.post<
    VendorResponse,
    SubmitVendorVerificationInput,
    Vendor
  >('/vendors/verification', data);
}

export function getPopularVendors(params: VendorRecommendationsParams) {
  return apiClient.get<VendorRecommendationResponse, VendorRecommendationResponseData>(
    '/vendors/popular',
    {
      params
    }
  );
}

export function getSimilarVendors(id: string, params?: SimilarVendorsParams) {
  return apiClient.get<VendorRecommendationResponse, VendorRecommendationResponseData>(
    `/vendors/${id}/similar`,
    {
      params
    }
  );
}

export function getVendorReviews(id: string, params?: VendorReviewsParams) {
  return apiClient.get<VendorReviewListResponse, VendorReviewListData>(`/vendors/${id}/reviews`, {
    params
  });
}

export function getVendorTrust(id: string) {
  return apiClient.get<VendorTrustSummaryResponse, VendorTrustSummary>(`/vendors/${id}/trust`);
}

export function getVendorDashboardSummary() {
  return apiClient.get<VendorAnalyticsSummaryResponse, VendorAnalyticsSummary>('/vendors/dashboard/summary');
}

export function getVendorDashboardRevenue(params?: VendorDashboardRevenueParams) {
  return apiClient.get<VendorAnalyticsRevenueResponse, VendorAnalyticsRevenueResponseData>('/vendors/dashboard/revenue', { params });
}

export function getVendorDashboardOrders(params?: VendorDashboardOrdersParams) {
  return apiClient.get<VendorAnalyticsOrdersResponse, VendorAnalyticsOrdersResponseData>('/vendors/dashboard/orders', { params });
}

export function getVendorDashboardTopProducts(params?: VendorDashboardTopProductsParams) {
  return apiClient.get<VendorAnalyticsTopProductsResponse, VendorAnalyticsTopProductsResponseData>('/vendors/dashboard/top-products', { params });
}

export function getVendorPayouts(params?: VendorPayoutsParams) {
  return apiClient.get<VendorPayoutListResponse, VendorPayoutListData>('/vendors/me/payouts', { params });
}

export function requestVendorPayout(data: TriggerVendorPayoutInput) {
  return apiClient.post<PayoutResponse, TriggerVendorPayoutInput, Payout>('/vendors/me/payouts/withdraw', data);
}

export function getCurrentVendorBalance() {
  return apiClient.get<VendorBalanceResponse, VendorBalance>('/vendors/balance');
}

