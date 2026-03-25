export interface PaymentMethod {
  id: string;
  provider: 'paystack';
  status: 'active' | 'disabled';
}
