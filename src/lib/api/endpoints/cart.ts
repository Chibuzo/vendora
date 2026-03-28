import type { Cart, CartResponse } from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type { AddToCartInput, UpdateCartItemInput } from '../types';

export function getCart() {
  return apiClient.get<CartResponse, Cart>('/cart');
}

export function addToCart(data: AddToCartInput) {
  return apiClient.post<CartResponse, AddToCartInput, Cart>('/cart/items', data);
}

export function updateCartItem(id: string, data: UpdateCartItemInput) {
  return apiClient.patch<CartResponse, UpdateCartItemInput, Cart>(`/cart/items/${id}`, data);
}

export function removeCartItem(id: string) {
  return apiClient.delete<CartResponse, Cart>(`/cart/items/${id}`);
}
