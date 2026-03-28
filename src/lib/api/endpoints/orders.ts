import type {
  Order,
  OrderResponse,
  VendorOrderListData,
  VendorOrderListResponse
} from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type { CreateOrderInput, UpdateVendorOrderStatusInput, VendorOrdersParams } from '../types';

export function createOrder(data: CreateOrderInput) {
  return apiClient.post<OrderResponse, CreateOrderInput, Order>('/orders', data);
}

export function getOrder(id: string) {
  return apiClient.get<OrderResponse, Order>(`/orders/${id}`);
}

export function getVendorOrders(params?: VendorOrdersParams) {
  return apiClient.get<VendorOrderListResponse, VendorOrderListData>('/vendors/orders', {
    params
  });
}

export function updateVendorOrderStatus(id: string, data: UpdateVendorOrderStatusInput) {
  return apiClient.patch<OrderResponse, UpdateVendorOrderStatusInput, Order>(
    `/vendors/orders/${id}/status`,
    data
  );
}
