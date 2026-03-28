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
import { createOrder, getOrder, getVendorOrders, updateVendorOrderStatus } from '../endpoints/orders';
import { cartKeys } from './useCart';
import type {
  CreateOrderInput,
  Order,
  UpdateVendorOrderStatusInput,
  VendorOrderListData,
  VendorOrdersParams
} from '../types';

type QueryOptions<TResult, TKey extends QueryKey> = Omit<
  UseQueryOptions<TResult, ApiClientError, TResult, TKey>,
  'queryFn' | 'queryKey'
>;

type MutationOptions<TResult, TVariables, TContext> = Omit<
  UseMutationOptions<TResult, ApiClientError, TVariables, TContext>,
  'mutationFn' | 'mutationKey'
>;

type OrderMutationContext = {
  previousDetail?: Order;
  previousLists: Array<[QueryKey, VendorOrderListData | undefined]>;
};

export const orderKeys = {
  detail: (id: string) => ['orders', 'detail', id] as const,
  vendorListsRoot: ['orders', 'vendor'] as const,
  vendorList: (params?: VendorOrdersParams) => ['orders', 'vendor', params ?? null] as const
};

function updateOrderListStatus(data: VendorOrderListData | undefined, orderId: string, status: Order['status']) {
  if (!data) {
    return data;
  }

  return {
    ...data,
    items: data.items.map((item) =>
      item.id === orderId
        ? {
            ...item,
            status
          }
        : item
    )
  };
}

export function useOrder(
  id: string,
  options?: QueryOptions<Order, ReturnType<typeof orderKeys.detail>>
) {
  const accessToken = useApiAuthStore((state) => state.accessToken);
  const hydrated = useApiAuthStore((state) => state.hydrated);

  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: hydrated && Boolean(accessToken) && Boolean(id) && (options?.enabled ?? true),
    ...options
  });
}

export function useVendorOrders(
  params?: VendorOrdersParams,
  options?: QueryOptions<VendorOrderListData, ReturnType<typeof orderKeys.vendorList>>
) {
  const accessToken = useApiAuthStore((state) => state.accessToken);
  const hydrated = useApiAuthStore((state) => state.hydrated);

  return useQuery({
    queryKey: orderKeys.vendorList(params),
    queryFn: () => getVendorOrders(params),
    enabled: hydrated && Boolean(accessToken) && (options?.enabled ?? true),
    ...options
  });
}

export function useCreateOrder(options?: MutationOptions<Order, CreateOrderInput, void>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<Order, ApiClientError, CreateOrderInput, void>({
    mutationKey: ['orders', 'create'],
    mutationFn: createOrder,
    ...restOptions,
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(orderKeys.detail(data.id), data);
      queryClient.removeQueries({
        queryKey: cartKeys.current
      });
      void queryClient.invalidateQueries({
        queryKey: orderKeys.vendorListsRoot
      });
      onSuccess?.(data, variables, onMutateResult, context);
    }
  });
}

export function useUpdateVendorOrderStatus(
  options?: MutationOptions<
    Order,
    { id: string; data: UpdateVendorOrderStatusInput },
    OrderMutationContext
  >
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<
    Order,
    ApiClientError,
    { id: string; data: UpdateVendorOrderStatusInput },
    OrderMutationContext
  >({
    mutationKey: ['orders', 'vendor', 'status'],
    mutationFn: ({ id, data }) => updateVendorOrderStatus(id, data),
    ...restOptions,
    async onMutate(variables, mutationContext) {
      await queryClient.cancelQueries({
        queryKey: orderKeys.vendorListsRoot
      });
      await queryClient.cancelQueries({
        queryKey: orderKeys.detail(variables.id)
      });

      const previousDetail = queryClient.getQueryData<Order>(orderKeys.detail(variables.id));
      const previousLists = queryClient.getQueriesData<VendorOrderListData>({
        queryKey: orderKeys.vendorListsRoot
      });

      if (previousDetail) {
        queryClient.setQueryData(orderKeys.detail(variables.id), {
          ...previousDetail,
          status: variables.data.status
        });
      }

      for (const [key, value] of previousLists) {
        queryClient.setQueryData(
          key,
          updateOrderListStatus(value, variables.id, variables.data.status)
        );
      }

      const onMutateResult = {
        previousDetail,
        previousLists
      };

      await onMutate?.(variables, mutationContext);
      return onMutateResult;
    },
    onError(error, variables, onMutateResult, context) {
      if (onMutateResult?.previousDetail) {
        queryClient.setQueryData(orderKeys.detail(variables.id), onMutateResult.previousDetail);
      }

      for (const [key, value] of onMutateResult?.previousLists ?? []) {
        queryClient.setQueryData(key, value);
      }

      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.setQueryData(orderKeys.detail(data.id), data);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled(data, error, variables, onMutateResult, context) {
      void queryClient.invalidateQueries({
        queryKey: orderKeys.vendorListsRoot
      });
      void queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id)
      });
      onSettled?.(data, error, variables, onMutateResult, context);
    }
  });
}
