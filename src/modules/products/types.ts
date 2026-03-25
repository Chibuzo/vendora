export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  vendorName: string;
  trustScore: number;
  imageUrl: string;
  featured: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'trust';
  limit: number;
}

export interface ProductCatalogResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
