export interface MarketplaceVendorCard {
  id: string;
  slug: string;
  businessName: string;
  location: string;
  trustScore: number;
  rating: number;
  totalOrders: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  description?: string;
  category?: string;
  phone?: string;
}

export interface MarketplaceProductCard {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  location: string;
  trustScore: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  images: Array<{ id: string; url: string }>;
  variants: Array<{ id: string; name: string; priceDelta: number }>;
  stockQuantity: number;
  isAvailable: boolean;
  tags: string[];
  featured: boolean;
}

export interface HomeData {
  popularVendors: MarketplaceVendorCard[];
  recommendedProducts: MarketplaceProductCard[];
  categories: string[];
}

export interface VendorsDirectoryData {
  items: MarketplaceVendorCard[];
  filters: {
    states: string[];
    categories: string[];
  };
}

export interface VendorDetailsData {
  vendor: MarketplaceVendorCard & {
    address: string;
    state: string;
    city: string;
    trustBreakdown: Array<{ label: string; score: number }>;
  };
  products: MarketplaceProductCard[];
}

export interface ProductCatalogData {
  items: MarketplaceProductCard[];
  filters: {
    categories: string[];
    states: string[];
  };
}

export interface ProductDetailsData {
  product: MarketplaceProductCard & {
    vendor: MarketplaceVendorCard;
    trustBadge: 'verified' | 'high-trust';
  };
  relatedProducts: MarketplaceProductCard[];
}

export interface SearchResultsData {
  query: string;
  vendors: MarketplaceVendorCard[];
  products: MarketplaceProductCard[];
}

export interface SearchSuggestionsData {
  vendors: MarketplaceVendorCard[];
  products: MarketplaceProductCard[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

export interface ResolvedCartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedVariantIds: string[];
  unitPrice: number;
  totalPrice: number;
  product: MarketplaceProductCard;
}

export interface ResolvedCart {
  id: string;
  currency: string;
  totalItems: number;
  subtotal: number;
  items: ResolvedCartItem[];
  updatedAt: string;
}

export interface OrderView {
  id: string;
  buyerId: string;
  vendorId: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  createdAt: string;
  deliveryAddress: string;
  paymentReference?: string;
  vendor: MarketplaceVendorCard;
  items: ResolvedCartItem[];
  timeline: Array<{
    id: string;
    title: string;
    status: OrderView['status'];
    completedAt?: string;
  }>;
}

export interface NotificationView {
  id: string;
  type: 'ORDER_UPDATE' | 'PAYOUT_UPDATE' | 'REVIEW_RECEIVED' | 'SYSTEM';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface VendorDashboardData {
  vendor: MarketplaceVendorCard;
  stats: {
    revenue: number;
    orders: number;
    rating: number;
    balance: number;
  };
  revenuePoints: Array<{ label: string; value: number }>;
  orderPoints: Array<{ label: string; value: number }>;
  topProducts: Array<{ name: string; unitsSold: number; revenue: number; trustStatus: 'verified' | 'high-trust' }>;
  recentOrders: OrderView[];
}

export interface VendorPayoutData {
  balance: {
    vendorId: string;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
  };
  payouts: Array<{
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    reference: string;
    initiatedAt: string;
  }>;
  transactions: Array<{
    id: string;
    type: 'ORDER' | 'PAYOUT';
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'PENDING';
    reference: string;
    createdAt: string;
  }>;
}

export interface VendorAnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalPaidOrders: number;
    totalDeliveredOrders: number;
    totalCancelledOrders: number;
    totalReviews: number;
    averageRating: number;
    totalUnitsSold: number;
  };
  revenuePoints: Array<{ label: string; value: number }>;
  orderPoints: Array<{ label: string; value: number }>;
  topProducts: Array<{ name: string; unitsSold: number; revenue: number; trustStatus: 'verified' | 'high-trust' }>;
}
