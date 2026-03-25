export interface OrderSummary {
  id: string;
  status: 'pending' | 'paid' | 'fulfilled';
  amount: number;
}
