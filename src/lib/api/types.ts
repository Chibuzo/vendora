import type {
  ActivityRequest,
  AddProductImagesRequest,
  AddVendorLocationRequest,
  AuthSession,
  AuthTokens,
  Cart,
  CartItem,
  CartItemRequest,
  CartItemUpdateRequest,
  CreateFraudReportRequest,
  CreateOrderRequest,
  CreateProductRequest,
  CreateReviewRequest,
  CreateVendorPayoutRequest,
  CreateVendorRequest,
  Empty,
  EmailLoginRequest,
  EmailSignupRequest,
  GetPersonalizedRecommendationsParams,
  GetSearchSuggestionsParams,
  GetVendorsDashboardOrdersParams,
  GetVendorsDashboardRevenueParams,
  GetVendorsDashboardTopProductsParams,
  InitializePaymentRequest,
  ListCurrentVendorProductsParams,
  ListNotificationsParams,
  ListPopularVendorsParams,
  ListProductsParams,
  ListSimilarVendorsParams,
  ListVendorOrdersParams,
  ListVendorPayoutsParams,
  ListVendorReviewsParams,
  ListVendorTransactionsParams,
  ListVendorsParams,
  Notification,
  NotificationListData,
  Order,
  OrderStatus,
  OtpChallenge,
  PaginationInfo,
  PaymentInitialization,
  Payout,
  PersonalizedRecommendationResponseData,
  Product,
  ProductListData,
  ProductSummary,
  Review,
  SearchListData,
  SearchSuggestionData,
  SearchVendorsParams,
  SetupVendorPayoutAccountRequest,
  SignupCompleteRequest,
  SubmitVendorVerificationRequest,
  UpdateFraudReportStatusRequest,
  UpdateProductRequest,
  UpdateVendorRequest,
  UpsertProductVariantsRequest,
  User,
  Vendor,
  VendorAccount,
  VendorAnalyticsOrdersResponseData,
  VendorAnalyticsRevenueResponseData,
  VendorAnalyticsSummary,
  VendorAnalyticsTopProductsResponseData,
  VendorBalance,
  VendorCard,
  VendorListData,
  VendorOnboardingStatus,
  VendorOrderListData,
  VendorOrderStatusUpdateRequest,
  VendorRecommendationResponseData,
  VendorReviewListData,
  VendorTransactionListData,
  VendorTrustSummary,
  VendorPayoutListData
} from '@/shared/api/generated/model';

export { OrderStatus as OrderStatusValues } from '@/shared/api/generated/model';

export type ApiErrorDetails = Record<string, unknown>;

export type ApiError = {
  message: string;
  details?: ApiErrorDetails;
  status?: number;
  requestId?: string;
};

export type ApiResponseMeta = {
  requestId?: string;
  rateLimit?: {
    limit?: number;
    remaining?: number;
    reset?: number;
  } | null;
};

export type ApiEnvelope<T> = {
  data: T;
  meta?: ApiResponseMeta;
  error?: {
    message?: string;
    details?: ApiErrorDetails;
  } | null;
  success?: boolean;
};

export type ApiQueryPrimitive = string | number | boolean | null | undefined;
export type ApiQueryValue = ApiQueryPrimitive | readonly ApiQueryPrimitive[];
export type ApiQueryParams = Record<string, ApiQueryValue>;

export type Pagination = PaginationInfo;
export type PaginatedResult<T> = {
  items: T[];
  pagination: Pagination;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
};

export type SetAuthInput = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: User | null;
};

export type SignupEmailInput = EmailSignupRequest;
export type SignupPhoneSendOtpInput = import('@/shared/api/generated/model').PhoneOtpSendRequest;
export type SignupPhoneVerifyInput = import('@/shared/api/generated/model').PhoneOtpVerifyRequest;
export type SignupCompleteInput = SignupCompleteRequest;
export type LoginEmailInput = EmailLoginRequest;
export type LoginPhoneSendOtpInput = import('@/shared/api/generated/model').PhoneOtpSendRequest;
export type LoginPhoneVerifyInput = import('@/shared/api/generated/model').PhoneOtpVerifyRequest;
export type VendorsListParams = ListVendorsParams;
export type VendorRecommendationsParams = ListPopularVendorsParams;
export type SimilarVendorsParams = ListSimilarVendorsParams;
export type VendorReviewsParams = ListVendorReviewsParams;
export type ProductsListParams = ListProductsParams;
export type CurrentVendorProductsParams = ListCurrentVendorProductsParams;
export type VendorOrdersParams = ListVendorOrdersParams;
export type VendorPayoutsParams = ListVendorPayoutsParams;
export type VendorTransactionsParams = ListVendorTransactionsParams;
export type NotificationsListParams = ListNotificationsParams;
export type SearchParams = SearchVendorsParams;
export type SearchSuggestionsParams = GetSearchSuggestionsParams;
export type PersonalizedRecommendationsParams = GetPersonalizedRecommendationsParams;
export type VendorDashboardOrdersParams = GetVendorsDashboardOrdersParams;
export type VendorDashboardRevenueParams = GetVendorsDashboardRevenueParams;
export type VendorDashboardTopProductsParams = GetVendorsDashboardTopProductsParams;
export type AddToCartInput = CartItemRequest;
export type UpdateCartItemInput = CartItemUpdateRequest;
export type CreateOrderInput = CreateOrderRequest;
export type InitializePaymentInput = InitializePaymentRequest;
export type CreateReviewInput = CreateReviewRequest;
export type CreateVendorInput = CreateVendorRequest;
export type UpdateVendorInput = UpdateVendorRequest;
export type CreateProductInput = CreateProductRequest;
export type UpdateProductInput = UpdateProductRequest;
export type UpsertProductVariantsInput = UpsertProductVariantsRequest;
export type AddProductImagesInput = AddProductImagesRequest;
export type AddVendorLocationInput = AddVendorLocationRequest;
export type SubmitVendorVerificationInput = SubmitVendorVerificationRequest;
export type UpdateVendorOrderStatusInput = VendorOrderStatusUpdateRequest;
export type SetupVendorPayoutAccountInput = SetupVendorPayoutAccountRequest;
export type TriggerVendorPayoutInput = CreateVendorPayoutRequest;
export type CreateFraudReportInput = CreateFraudReportRequest;
export type UpdateFraudReportStatusInput = UpdateFraudReportStatusRequest;

export type {
  ActivityRequest,
  AuthSession,
  AuthTokens,
  Cart,
  CartItem,
  CreateFraudReportRequest,
  Empty,
  Notification,
  NotificationListData,
  Order,
  OrderStatus,
  OtpChallenge,
  PaginationInfo,
  PaymentInitialization,
  Payout,
  PersonalizedRecommendationResponseData,
  Product,
  ProductListData,
  ProductSummary,
  Review,
  SearchListData,
  SearchSuggestionData,
  User,
  Vendor,
  VendorAccount,
  VendorAnalyticsOrdersResponseData,
  VendorAnalyticsRevenueResponseData,
  VendorAnalyticsSummary,
  VendorAnalyticsTopProductsResponseData,
  VendorBalance,
  VendorCard,
  VendorListData,
  VendorOnboardingStatus,
  VendorOrderListData,
  VendorRecommendationResponseData,
  VendorReviewListData,
  VendorTransactionListData,
  VendorTrustSummary,
  VendorPayoutListData
};
