'use client';

import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type {
  HomeData,
  NotificationView,
  OrderView,
  ProductCatalogData,
  ProductDetailsData,
  ResolvedCart,
  SearchResultsData,
  SearchSuggestionsData,
  VendorAnalyticsData,
  VendorDashboardData,
  VendorDetailsData,
  VendorPayoutData,
  VendorsDirectoryData
} from '@/modules/marketplace/types';

const keys = {
  productsRoot: ['marketplace', 'products'] as const,
  home: ['marketplace', 'home'] as const,
  vendors: (filters: unknown) => ['marketplace', 'vendors', filters] as const,
  vendor: (slug: string) => ['marketplace', 'vendor', slug] as const,
  products: (filters: unknown) => ['marketplace', 'products', filters] as const,
  product: (slug: string) => ['marketplace', 'product', slug] as const,
  search: (filters: unknown) => ['marketplace', 'search', filters] as const,
  suggestions: (query: string) => ['marketplace', 'suggestions', query] as const,
  cart: ['marketplace', 'cart'] as const,
  orders: ['marketplace', 'orders'] as const,
  order: (id: string) => ['marketplace', 'order', id] as const,
  notifications: ['marketplace', 'notifications'] as const,
  vendorDashboard: ['marketplace', 'vendor', 'dashboard'] as const,
  vendorProducts: ['marketplace', 'vendor', 'products'] as const,
  vendorOrders: ['marketplace', 'vendor', 'orders'] as const,
  vendorPayouts: ['marketplace', 'vendor', 'payouts'] as const,
  vendorAnalytics: ['marketplace', 'vendor', 'analytics'] as const
};

function queryString(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });

  const serialized = search.toString();
  return serialized ? `?${serialized}` : '';
}

export function useMarketplaceHome() {
  return useQuery({
    queryKey: keys.home,
    queryFn: async () => (await apiClient.get<HomeData>('/marketplace/home')).data
  });
}

export function useMarketplaceVendors(filters: { state?: string; category?: string; sort?: string }) {
  return useQuery({
    queryKey: keys.vendors(filters),
    queryFn: async () =>
      (await apiClient.get<VendorsDirectoryData>(`/marketplace/vendors${queryString(filters)}`)).data
  });
}

export function useMarketplaceVendor(slug: string) {
  return useQuery({
    queryKey: keys.vendor(slug),
    queryFn: async () => (await apiClient.get<VendorDetailsData>(`/marketplace/vendors/${slug}`)).data,
    enabled: Boolean(slug)
  });
}

export function useMarketplaceProducts(filters: {
  q?: string;
  category?: string;
  state?: string;
  vendorId?: string;
  sort?: string;
}) {
  return useQuery({
    queryKey: keys.products(filters),
    queryFn: async () =>
      (await apiClient.get<ProductCatalogData>(`/marketplace/products${queryString(filters)}`)).data
  });
}

export function useMarketplaceProduct(slug: string) {
  return useQuery({
    queryKey: keys.product(slug),
    queryFn: async () => (await apiClient.get<ProductDetailsData>(`/marketplace/products/${slug}`)).data,
    enabled: Boolean(slug)
  });
}

export function useMarketplaceSearch(filters: {
  q?: string;
  category?: string;
  state?: string;
  verifiedOnly?: boolean;
}) {
  return useQuery({
    queryKey: keys.search(filters),
    queryFn: async () =>
      (await apiClient.get<SearchResultsData>(`/marketplace/search${queryString(filters)}`)).data
  });
}

export function useMarketplaceSuggestions(query: string) {
  return useQuery({
    queryKey: keys.suggestions(query),
    queryFn: async () =>
      (await apiClient.get<SearchSuggestionsData>(`/marketplace/search/suggestions${queryString({ q: query })}`)).data,
    enabled: query.trim().length > 0
  });
}

export function useBuyerCart() {
  return useQuery({
    queryKey: keys.cart,
    queryFn: async () => (await apiClient.get<ResolvedCart>('/marketplace/cart')).data
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { productId: string; quantity: number; selectedVariantIds?: string[] }) =>
      (await apiClient.post<ResolvedCart, typeof payload>('/marketplace/cart/items', payload)).data,
    onSuccess(data) {
      queryClient.setQueryData(keys.cart, data);
    }
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { itemId: string; quantity?: number; selectedVariantIds?: string[] }) =>
      (
        await apiClient.patch<ResolvedCart, Omit<typeof payload, 'itemId'>>(
          `/marketplace/cart/items/${payload.itemId}`,
          {
            quantity: payload.quantity,
            selectedVariantIds: payload.selectedVariantIds
          }
        )
      ).data,
    onSuccess(data) {
      queryClient.setQueryData(keys.cart, data);
    }
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) =>
      (await apiClient.delete<ResolvedCart>(`/marketplace/cart/items/${itemId}`)).data,
    onSuccess(data) {
      queryClient.setQueryData(keys.cart, data);
    }
  });
}

export function useBuyerOrders() {
  return useQuery({
    queryKey: keys.orders,
    queryFn: async () => (await apiClient.get<OrderView[]>('/marketplace/orders')).data
  });
}

export function useBuyerOrder(id: string) {
  return useQuery({
    queryKey: keys.order(id),
    queryFn: async () => (await apiClient.get<OrderView>(`/marketplace/orders/${id}`)).data,
    enabled: Boolean(id)
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      vendorId: string;
      deliveryAddress: string;
      items: Array<{ productId: string; quantity: number; selectedVariantIds?: string[] }>;
    }) => (await apiClient.post<OrderView, typeof payload>('/marketplace/orders', payload)).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.cart });
      void queryClient.invalidateQueries({ queryKey: keys.orders });
      void queryClient.invalidateQueries({ queryKey: keys.vendorOrders });
      void queryClient.invalidateQueries({ queryKey: keys.vendorDashboard });
      void queryClient.invalidateQueries({ queryKey: keys.vendorAnalytics });
      void queryClient.invalidateQueries({ queryKey: keys.vendorPayouts });
    }
  });
}

export function useInitializePayment() {
  return useMutation({
    mutationFn: async (payload: { amount: number; email?: string }) =>
      (await apiClient.post<{ authorizationUrl: string; accessCode: string; reference: string; expiresAt: string }, typeof payload>(
        '/marketplace/payments/initialize',
        payload
      )).data
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: keys.notifications,
    queryFn: async () => (await apiClient.get<NotificationView[]>('/marketplace/notifications')).data
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.patch<NotificationView, undefined>(`/marketplace/notifications/${id}`)).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.notifications });
    }
  });
}

export function useVendorDashboard() {
  return useQuery({
    queryKey: keys.vendorDashboard,
    queryFn: async () => (await apiClient.get<VendorDashboardData>('/marketplace/vendor/dashboard')).data
  });
}

export function useVendorProducts() {
  return useQuery({
    queryKey: keys.vendorProducts,
    queryFn: async () => (await apiClient.get<ProductCatalogData['items']>('/marketplace/vendor/products')).data
  });
}

export function useCreateVendorProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      description: string;
      category: string;
      price: number;
      stockQuantity: number;
    }) => (await apiClient.post('/marketplace/vendor/products', payload)).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.vendorProducts });
      void queryClient.invalidateQueries({ queryKey: keys.productsRoot });
    }
  });
}

export function useUpdateVendorProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      name?: string;
      description?: string;
      category?: string;
      price?: number;
      stockQuantity?: number;
    }) =>
      (
        await apiClient.patch(
          `/marketplace/vendor/products/${payload.id}`,
          payload
        )
      ).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.vendorProducts });
      void queryClient.invalidateQueries({ queryKey: keys.productsRoot });
    }
  });
}

export function useDeleteVendorProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/marketplace/vendor/products/${id}`)).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.vendorProducts });
      void queryClient.invalidateQueries({ queryKey: keys.productsRoot });
    }
  });
}

export function useVendorOrders() {
  return useQuery({
    queryKey: keys.vendorOrders,
    queryFn: async () => (await apiClient.get<OrderView[]>('/marketplace/vendor/orders')).data
  });
}

export function useUpdateVendorOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; status: OrderView['status'] }) =>
      (await apiClient.patch(`/marketplace/vendor/orders/${payload.id}`, { status: payload.status })).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.vendorOrders });
      void queryClient.invalidateQueries({ queryKey: keys.vendorDashboard });
      void queryClient.invalidateQueries({ queryKey: keys.vendorAnalytics });
    }
  });
}

export function useVendorPayouts() {
  return useQuery({
    queryKey: keys.vendorPayouts,
    queryFn: async () => (await apiClient.get<VendorPayoutData>('/marketplace/vendor/payouts')).data
  });
}

export function useWithdrawVendorBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) =>
      (await apiClient.post('/marketplace/vendor/payouts', { amount })).data,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: keys.vendorPayouts });
      void queryClient.invalidateQueries({ queryKey: keys.vendorDashboard });
    }
  });
}

export function useVendorAnalytics() {
  return useQuery({
    queryKey: keys.vendorAnalytics,
    queryFn: async () => (await apiClient.get<VendorAnalyticsData>('/marketplace/vendor/analytics')).data
  });
}

export function useVendorSetup() {
  return useMutation({
    mutationFn: async (payload: {
      businessName: string;
      description: string;
      phone: string;
      category: string;
    }) => (await apiClient.post('/marketplace/onboarding/vendor', payload)).data
  });
}

export function useVendorLocation() {
  return useMutation({
    mutationFn: async (payload: { state: string; city: string; address: string }) =>
      (await apiClient.post('/marketplace/onboarding/vendor/location', payload)).data
  });
}

export function useVendorVerification() {
  return useMutation({
    mutationFn: async (payload: { cacNumber: string }) =>
      (await apiClient.post('/marketplace/onboarding/vendor/verification', payload)).data
  });
}
