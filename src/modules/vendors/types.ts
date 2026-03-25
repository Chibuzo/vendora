export interface VendorProfile {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  verified: boolean;
  trustScore: number;
  lifetimeRevenue: number;
  completionRate: number;
  responseTimeInMinutes: number;
  payoutStatus: 'healthy' | 'review' | 'delayed';
  monthlyOrders: number;
}
