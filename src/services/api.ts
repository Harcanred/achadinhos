import { Product, Category, Article, ClickLog } from '../types';
import { StorageService } from './storage';

export class ApiClient {
  static async getProducts(params?: {
    category?: string;
    q?: string;
    viral?: boolean;
    bestSeller?: boolean;
    deal?: boolean;
    maxPrice?: number;
  }): Promise<Product[]> {
    try {
      const search = new URLSearchParams();
      if (params?.category) search.append('category', params.category);
      if (params?.q) search.append('q', params.q);
      if (params?.viral) search.append('viral', 'true');
      if (params?.bestSeller) search.append('bestSeller', 'true');
      if (params?.deal) search.append('deal', 'true');
      if (params?.maxPrice) search.append('maxPrice', String(params.maxPrice));

      const res = await fetch(`/api/products?${search.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // fallback to StorageService
    }
    // Client-side filtering fallback
    let items = StorageService.getActiveProducts();
    if (params?.category) {
      items = items.filter(p => p.category === params.category);
    }
    if (params?.viral) {
      items = items.filter(p => p.isViral);
    }
    if (params?.bestSeller) {
      items = items.filter(p => p.isBestSeller);
    }
    if (params?.deal) {
      items = items.filter(p => p.isDailyDeal);
    }
    if (params?.maxPrice) {
      items = items.filter(p => p.currentPrice <= params.maxPrice!);
    }
    if (params?.q) {
      const q = params.q.toLowerCase();
      items = items.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return items;
  }

  static async getProduct(slugOrId: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${slugOrId}`);
      if (res.ok) {
        const data = await res.json();
        StorageService.recordProductView(data.id);
        return data;
      }
    } catch {
      // fallback
    }
    const local = StorageService.getProductBySlug(slugOrId);
    if (local) {
      StorageService.recordProductView(local.id);
      return local;
    }
    return null;
  }

  static async recordAffiliateClick(productId: string, referrer = 'direct'): Promise<string | null> {
    StorageService.recordAffiliateClick(productId, referrer);
    try {
      const res = await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, referrer }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.affiliateUrl || null;
      }
    } catch {
      // local will suffice
    }
    const p = StorageService.getProductById(productId);
    return p?.affiliateUrl || null;
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return StorageService.getCategories();
  }

  static async getArticles(): Promise<Article[]> {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return StorageService.getArticles();
  }

  static async getArticle(slug: string): Promise<Article | null> {
    try {
      const res = await fetch(`/api/articles/${slug}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return StorageService.getArticleBySlug(slug) || null;
  }

  static async getStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    totalViews: number;
    totalClicks: number;
    overallCTR: string;
    topProducts: Product[];
    categoryClicks: Record<string, number>;
    recentClicks: ClickLog[];
  }> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return StorageService.getAnalyticsSummary();
  }
}
