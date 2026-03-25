import type { Product } from '@/modules/products/types';
import type { VendorProfile } from '@/modules/vendors/types';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Solar Backup Kit',
    description: 'Reliable home backup power package for urban households.',
    price: 280000,
    currency: 'NGN',
    category: 'Energy',
    vendorName: 'GreenGrid Supplies',
    trustScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80',
    featured: true
  },
  {
    id: 'prod_2',
    name: 'Commercial POS Terminal',
    description: 'Counter-ready device bundle for fast checkout across retail branches.',
    price: 95000,
    currency: 'NGN',
    category: 'Retail',
    vendorName: 'Tillstack Devices',
    trustScore: 89,
    imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    featured: true
  },
  {
    id: 'prod_3',
    name: 'Cold Chain Storage Box',
    description: 'Temperature-controlled container for last-mile food and pharma delivery.',
    price: 142000,
    currency: 'NGN',
    category: 'Logistics',
    vendorName: 'Northline Logistics',
    trustScore: 96,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    featured: true
  },
  {
    id: 'prod_4',
    name: 'Warehouse Barcode Scanner',
    description: 'Fast scan throughput with rugged casing for heavy-duty inventory teams.',
    price: 67000,
    currency: 'NGN',
    category: 'Operations',
    vendorName: 'StockPilot Tech',
    trustScore: 90,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    featured: false
  },
  {
    id: 'prod_5',
    name: 'Premium Packaging Set',
    description: 'Elevated packaging suite for fashion, gifting, and premium fulfillment.',
    price: 25000,
    currency: 'NGN',
    category: 'Packaging',
    vendorName: 'Parcel Atelier',
    trustScore: 85,
    imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    featured: false
  },
  {
    id: 'prod_6',
    name: 'Inventory Demand Forecast Pack',
    description: 'Decision support dataset and dashboard template for weekly replenishment.',
    price: 49000,
    currency: 'NGN',
    category: 'Analytics',
    vendorName: 'Metric Harbor',
    trustScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    featured: false
  }
];

export const mockVendorProfile: VendorProfile = {
  id: 'vendor_1',
  businessName: 'GreenGrid Supplies',
  ownerName: 'Amina Balogun',
  category: 'Energy',
  verified: true,
  trustScore: 94,
  lifetimeRevenue: 4800000,
  completionRate: 98,
  responseTimeInMinutes: 12,
  payoutStatus: 'healthy',
  monthlyOrders: 126
};
