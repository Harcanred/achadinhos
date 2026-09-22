import { Product, Category, ClickLog, Article } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ARTICLES } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'achadinhos_products_v1',
  CATEGORIES: 'achadinhos_categories_v1',
  ARTICLES: 'achadinhos_articles_v1',
  CLICKS: 'achadinhos_clicks_v1',
  ADMIN_TOKEN: 'achadinhos_admin_token',
  ADMIN_PASSWORD: 'achadinhos_admin_password',
  COOKIE_CONSENT: 'achadinhos_cookie_consent',
};

// Default admin credentials
const DEFAULT_ADMIN_PASS = 'admin123';

export class StorageService {
  // PRODUCTS
  static getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    // Seed default
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  static getActiveProducts(): Product[] {
    return this.getProducts().filter(p => p.isActive);
  }

  static getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find(p => p.slug === slug || p.id === slug);
  }

  static getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }

  static addProduct(product: Omit<Product, 'id' | 'createdAt' | 'views' | 'clicks'>): Product {
    const products = this.getProducts();
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...product,
      id,
      slug: product.slug || this.generateSlug(product.name),
      createdAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    this.saveProducts(products);
    return products[index];
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  }

  static duplicateProduct(id: string): Product | null {
    const products = this.getProducts();
    const item = products.find(p => p.id === id);
    if (!item) return null;

    const copy: Product = {
      ...item,
      id: `prod-${Date.now()}`,
      name: `${item.name} (Cópia)`,
      slug: `${item.slug}-copia-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
    };
    products.unshift(copy);
    this.saveProducts(products);
    return copy;
  }

  static toggleProductStatus(id: string): Product | null {
    const products = this.getProducts();
    const item = products.find(p => p.id === id);
    if (!item) return null;
    item.isActive = !item.isActive;
    this.saveProducts(products);
    return item;
  }

  // CATEGORIES
  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    this.saveCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }

  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }

  static addCategory(cat: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const id = cat.slug || this.generateSlug(cat.name);
    const newCat: Category = { ...cat, id };
    categories.push(newCat);
    this.saveCategories(categories);
    return newCat;
  }

  // ARTICLES
  static getArticles(): Article[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    this.saveArticles(INITIAL_ARTICLES);
    return INITIAL_ARTICLES;
  }

  static saveArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  }

  static getArticleBySlug(slug: string): Article | undefined {
    return this.getArticles().find(a => a.slug === slug || a.id === slug);
  }

  static addArticle(article: Omit<Article, 'id' | 'publishedAt'>): Article {
    const articles = this.getArticles();
    const id = `art-${Date.now()}`;
    const newArt: Article = {
      ...article,
      id,
      slug: article.slug || this.generateSlug(article.title),
      publishedAt: new Date().toISOString().split('T')[0],
    };
    articles.unshift(newArt);
    this.saveArticles(articles);
    return newArt;
  }

  // CLICK TRACKING & ANALYTICS
  static recordProductView(productId: string): void {
    const products = this.getProducts();
    const p = products.find(item => item.id === productId);
    if (p) {
      p.views = (p.views || 0) + 1;
      this.saveProducts(products);
    }
  }

  static recordAffiliateClick(productId: string, referrer = 'direct'): void {
    const products = this.getProducts();
    const p = products.find(item => item.id === productId);
    if (p) {
      p.clicks = (p.clicks || 0) + 1;
      this.saveProducts(products);

      // Log detailed click event
      try {
        const clicks = this.getClicks();
        const clickLog: ClickLog = {
          id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          productId: p.id,
          productName: p.name,
          category: p.category,
          timestamp: new Date().toISOString(),
          referrer,
          device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        };
        // Keep last 1000 clicks
        clicks.unshift(clickLog);
        if (clicks.length > 1000) clicks.pop();
        localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(clicks));
      } catch (e) {
        console.error(e);
      }
    }
  }

  static getClicks(): ClickLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLICKS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  static getAnalyticsSummary() {
    const products = this.getProducts();
    const clicks = this.getClicks();
    const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
    const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    // Top clicked products
    const sortedByClicks = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

    // Clicks by category
    const categoryClicks: Record<string, number> = {};
    clicks.forEach(c => {
      categoryClicks[c.category] = (categoryClicks[c.category] || 0) + 1;
    });

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalViews,
      totalClicks,
      overallCTR,
      topProducts: sortedByClicks.slice(0, 10),
      categoryClicks,
      recentClicks: clicks.slice(0, 20),
    };
  }

  // ADMIN AUTH
  static verifyAdminLogin(password: string): boolean {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASS;
    if (password === saved) {
      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      return true;
    }
    return false;
  }

  static isAdminLoggedIn(): boolean {
    return Boolean(sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN));
  }

  static adminLogout(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  }

  static changeAdminPassword(newPass: string): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
  }

  // COOKIE CONSENT
  static getCookieConsent(): boolean {
    return localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT) === 'accepted';
  }

  static setCookieConsent(accepted: boolean): void {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, accepted ? 'accepted' : 'declined');
  }

  // BACKUP EXPORT & IMPORT
  static exportBackupJSON(): string {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      categories: this.getCategories(),
      articles: this.getArticles(),
      clicks: this.getClicks(),
    };
    return JSON.stringify(payload, null, 2);
  }

  static importBackupJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) {
        this.saveProducts(data.products);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.saveCategories(data.categories);
      }
      if (data.articles && Array.isArray(data.articles)) {
        this.saveArticles(data.articles);
      }
      return true;
    } catch {
      return false;
    }
  }

  // UTILS
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
