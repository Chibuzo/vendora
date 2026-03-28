import type {
  Vendor,
  VendorOnboardingStatus,
  VendorOnboardingStatusResponse,
  VendorRecommendationResponse,
  VendorRecommendationResponseData,
  VendorResponse,
  VendorReviewListData,
  VendorReviewListResponse,
  VendorTrustSummaryResponse
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
  VendorListData
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
