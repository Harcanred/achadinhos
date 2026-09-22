export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  specs: { label: string; value: string }[];
  targetAudience: string;
  image: string;
  gallery: string[];
  currentPrice: number;
  previousPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  affiliateUrl: string;
  keywords: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isViral: boolean;
  isDailyDeal: boolean;
  isActive: boolean;
  createdAt: string;
  views: number;
  clicks: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color?: string;
}

export interface ClickLog {
  id: string;
  productId: string;
  productName: string;
  category: string;
  timestamp: string;
  referrer?: string;
  device?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  featuredProductIds: string[];
  author: string;
}

export type SortOption =
  | 'relevance'
  | 'sales'
  | 'priceAsc'
  | 'priceDesc'
  | 'discount'
  | 'rating'
  | 'newest';

export type PriceFilter = 'all' | 'under50' | 'under100' | 'over100';

export interface FilterState {
  query: string;
  category: string;
  priceRange: PriceFilter;
  sort: SortOption;
  onlyBestSellers: boolean;
  onlyVirals: boolean;
  onlyDeals: boolean;
}
