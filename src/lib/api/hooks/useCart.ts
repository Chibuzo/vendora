'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions
} from '@tanstack/react-query';

import { ApiClientError, useApiAuthStore } from '../client';
import { addToCart, getCart, removeCartItem, updateCartItem } from '../endpoints/cart';
import type { AddToCartInput, Cart, CartItem, UpdateCartItemInput } from '../types';

type QueryOptions<TResult, TKey extends QueryKey> = Omit<
  UseQueryOptions<TResult, ApiClientError, TResult, TKey>,
  'queryFn' | 'queryKey'
>;

type MutationOptions<TResult, TVariables, TContext> = Omit<
  UseMutationOptions<TResult, ApiClientError, TVariables, TContext>,
  'mutationFn' | 'mutationKey'
>;

type CartMutationContext = {
  previousCart?: Cart;
};

export const cartKeys = {
  current: ['cart'] as const
};

function normalizeVariantIds(ids?: string[]) {
  return [...(ids ?? [])].sort();
}

function matchesCartItem(item: CartItem, productId: string, selectedVariantIds?: string[]) {
  if (item.productId !== productId) {
    return false;
  }

  const existing = normalizeVariantIds(item.selectedVariantIds);
  const incoming = normalizeVariantIds(selectedVariantIds);

  return existing.length === incoming.length && existing.every((value, index) => value === incoming[index]);
}

function withUpdatedTotals(cart: Cart) {
  return {
    ...cart,
    totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    updatedAt: new Date().toISOString()
  };
}

function applyOptimisticAdd(cart: Cart | undefined, input: AddToCartInput) {
  if (!cart) {
    return cart;
  }

  const existingItem = cart.items.find((item) =>
    matchesCartItem(item, input.productId, input.selectedVariantIds)
  );

  const nextItems = existingItem
    ? cart.items.map((item) =>
        item.id === existingItem.id
          ? {
              ...item,
              quantity: item.quantity + input.quantity
            }
          : item
      )
    : [
        ...cart.items,
        {
          id: `optimistic-${input.productId}-${normalizeVariantIds(input.selectedVariantIds).join('-')}`,
          productId: input.productId,
          quantity: input.quantity,
          selectedVariantIds: [...(input.selectedVariantIds ?? [])]
        }
      ];

  return withUpdatedTotals({
    ...cart,
    items: nextItems
  });
}

function applyOptimisticUpdate(cart: Cart | undefined, itemId: string, input: UpdateCartItemInput) {
  if (!cart) {
    return cart;
  }

  return withUpdatedTotals({
    ...cart,
    items: cart.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: input.quantity ?? item.quantity,
            selectedVariantIds: [...(input.selectedVariantIds ?? item.selectedVariantIds)]
          }
        : item
    )
  });
}

function applyOptimisticRemove(cart: Cart | undefined, itemId: string) {
  if (!cart) {
    return cart;
  }

  return withUpdatedTotals({
    ...cart,
    items: cart.items.filter((item) => item.id !== itemId)
  });
}

export function useCart(options?: QueryOptions<Cart, typeof cartKeys.current>) {
  const accessToken = useApiAuthStore((state) => state.accessToken);
  const hydrated = useApiAuthStore((state) => state.hydrated);

  return useQuery({
    queryKey: cartKeys.current,
    queryFn: getCart,
    enabled: hydrated && Boolean(accessToken) && (options?.enabled ?? true),
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
    ...options
  });
}

export function useAddToCart(
  options?: MutationOptions<Cart, AddToCartInput, CartMutationContext>
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<Cart, ApiClientError, AddToCartInput, CartMutationContext>({
    mutationKey: ['cart', 'add'],
    mutationFn: addToCart,
    ...restOptions,
    async onMutate(variables, mutationContext) {
      await queryClient.cancelQueries({
        queryKey: cartKeys.current
      });

      const previousCart = queryClient.getQueryData<Cart>(cartKeys.current);

      queryClient.setQueryData(cartKeys.current, applyOptimisticAdd(previousCart, variables));

      const onMutateResult = { previousCart };
      await onMutate?.(variables, mutationContext);
      return onMutateResult;
    },
    onError(error, variables, onMutateResult, context) {
      if (onMutateResult?.previousCart) {
        queryClient.setQueryData(cartKeys.current, onMutateResult.previousCart);
      }

      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(cartKeys.current, data);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled(data, error, variables, onMutateResult, context) {
      void queryClient.invalidateQueries({
        queryKey: cartKeys.current
      });
      onSettled?.(data, error, variables, onMutateResult, context);
    }
  });
}

export function useUpdateCartItem(
  options?: MutationOptions<Cart, { id: string; data: UpdateCartItemInput }, CartMutationContext>
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<
    Cart,
    ApiClientError,
    { id: string; data: UpdateCartItemInput },
    CartMutationContext
  >({
    mutationKey: ['cart', 'update'],
    mutationFn: ({ id, data }) => updateCartItem(id, data),
    ...restOptions,
    async onMutate(variables, mutationContext) {
      await queryClient.cancelQueries({
        queryKey: cartKeys.current
      });

      const previousCart = queryClient.getQueryData<Cart>(cartKeys.current);

      queryClient.setQueryData(
        cartKeys.current,
        applyOptimisticUpdate(previousCart, variables.id, variables.data)
      );

      const onMutateResult = { previousCart };
      await onMutate?.(variables, mutationContext);
      return onMutateResult;
    },
    onError(error, variables, onMutateResult, context) {
      if (onMutateResult?.previousCart) {
        queryClient.setQueryData(cartKeys.current, onMutateResult.previousCart);
      }

      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(cartKeys.current, data);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled(data, error, variables, onMutateResult, context) {
      void queryClient.invalidateQueries({
        queryKey: cartKeys.current
      });
      onSettled?.(data, error, variables, onMutateResult, context);
    }
  });
}

export function useRemoveCartItem(
  options?: MutationOptions<Cart, string, CartMutationContext>
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<Cart, ApiClientError, string, CartMutationContext>({
    mutationKey: ['cart', 'remove'],
    mutationFn: removeCartItem,
    ...restOptions,
    async onMutate(itemId, mutationContext) {
      await queryClient.cancelQueries({
        queryKey: cartKeys.current
      });

      const previousCart = queryClient.getQueryData<Cart>(cartKeys.current);

      queryClient.setQueryData(cartKeys.current, applyOptimisticRemove(previousCart, itemId));

      const onMutateResult = { previousCart };
      await onMutate?.(itemId, mutationContext);
      return onMutateResult;
    },
    onError(error, variables, onMutateResult, context) {
      if (onMutateResult?.previousCart) {
        queryClient.setQueryData(cartKeys.current, onMutateResult.previousCart);
      }

      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(cartKeys.current, data);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled(data, error, variables, onMutateResult, context) {
      void queryClient.invalidateQueries({
        queryKey: cartKeys.current
      });
      onSettled?.(data, error, variables, onMutateResult, context);
    }
  });
}
