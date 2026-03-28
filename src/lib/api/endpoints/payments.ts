import type {
  PaymentInitialization,
  PaymentInitializationResponse,
  Payout,
  PayoutResponse,
  VendorAccount,
  VendorAccountResponse,
  VendorBalance,
  VendorBalanceResponse,
  VendorPayoutListData,
  VendorPayoutListResponse,
  VendorTransactionListData,
  VendorTransactionListResponse
} from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type {
  InitializePaymentInput,
  SetupVendorPayoutAccountInput,
  TriggerVendorPayoutInput,
  VendorPayoutsParams,
  VendorTransactionsParams
} from '../types';

export function initializePayment(data: InitializePaymentInput) {
  return apiClient.post<
    PaymentInitializationResponse,
    InitializePaymentInput,
    PaymentInitialization
  >('/payments/initialize', data);
}

export function setupVendorPayoutAccount(data: SetupVendorPayoutAccountInput) {
  return apiClient.post<
    VendorAccountResponse,
    SetupVendorPayoutAccountInput,
    VendorAccount
  >('/vendors/payout-accounts', data);
}

export function getCurrentVendorBalance() {
  return apiClient.get<VendorBalanceResponse, VendorBalance>('/vendors/balances/current');
}

export function getVendorPayouts(params?: VendorPayoutsParams) {
  return apiClient.get<VendorPayoutListResponse, VendorPayoutListData>('/vendors/payouts', {
    params
  });
}

export function triggerVendorPayout(data: TriggerVendorPayoutInput) {
  return apiClient.post<PayoutResponse, TriggerVendorPayoutInput, Payout>('/vendors/payouts', data);
}

export function getVendorTransactions(params?: VendorTransactionsParams) {
  return apiClient.get<VendorTransactionListResponse, VendorTransactionListData>(
    '/vendors/transactions',
    {
      params
    }
  );
}
