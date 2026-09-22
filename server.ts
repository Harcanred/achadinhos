import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ARTICLES } from './src/data/initialData';
import { Product, Category, Article, ClickLog } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_FILE = path.join(__dirname, 'data_store.json');

// In-memory data store with file persistence
let products: Product[] = [];
let categories: Category[] = [];
let articles: Article[] = [];
let clicks: ClickLog[] = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      products = data.products || INITIAL_PRODUCTS;
      categories = data.categories || INITIAL_CATEGORIES;
      articles = data.articles || INITIAL_ARTICLES;
      clicks = data.clicks || [];
      return;
    }
  } catch (e) {
    console.error('Error reading data store file, using initial data', e);
  }
  products = [...INITIAL_PRODUCTS];
  categories = [...INITIAL_CATEGORIES];
  articles = [...INITIAL_ARTICLES];
  clicks = [];
  saveData();
}

function saveData() {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ products, categories, articles, clicks }, null, 2),
      'utf-8'
    );
  } catch (e) {
    console.error('Error persisting data store to file', e);
  }
}

loadData();

async function startServer() {
  const app = express();
  app.use(express.json());

  // ROTA DEDICADA DE DOWNLOAD DO CÓDIGO-FONTE DO PROJETO
  app.get(['/download-project', '/achadinhos-shopee.tar.gz', '/achadinhos-shopee-completo.tar.gz'], (_req: Request, res: Response) => {
    const filePath = path.join(__dirname, 'public', 'achadinhos-shopee.tar.gz');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', 'attachment; filename="achadinhos-shopee-completo.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      return res.sendFile(filePath);
    }
    return res.status(404).send('Arquivo compactado não encontrado.');
  });

  // API: PRODUCTS
  app.get('/api/products', (req: Request, res: Response) => {
    let result = products.filter(p => p.isActive);
    const { category, q, viral, bestSeller, deal, maxPrice } = req.query;

    if (category && typeof category === 'string') {
      result = result.filter(p => p.category === category);
    }
    if (viral === 'true') {
      result = result.filter(p => p.isViral);
    }
    if (bestSeller === 'true') {
      result = result.filter(p => p.isBestSeller);
    }
    if (deal === 'true') {
      result = result.filter(p => p.isDailyDeal);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter(p => p.currentPrice <= Number(maxPrice));
    }
    if (q && typeof q === 'string') {
      const term = q.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term) ||
          p.keywords.some(k => k.toLowerCase().includes(term))
      );
    }

    res.json(result);
  });

  app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
    const { slugOrId } = req.params;
    const item = products.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (!item) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    // increment views
    item.views = (item.views || 0) + 1;
    saveData();
    res.json(item);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const payload = req.body;
    const id = `prod-${Date.now()}`;
    const slug =
      payload.slug ||
      payload.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProd: Product = {
      id,
      name: payload.name || 'Novo Produto',
      slug,
      category: payload.category || 'achadinhos',
      categoryName: payload.categoryName || 'Achadinhos',
      shortDescription: payload.shortDescription || '',
      description: payload.description || '',
      benefits: payload.benefits || [],
      specs: payload.specs || [],
      targetAudience: payload.targetAudience || '',
      image: payload.image || '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
      gallery: payload.gallery || [],
      currentPrice: Number(payload.currentPrice) || 0,
      previousPrice: Number(payload.previousPrice) || 0,
      discountPercent: Number(payload.discountPercent) || 0,
      rating: Number(payload.rating) || 5.0,
      reviewCount: Number(payload.reviewCount) || 1,
      soldCount: Number(payload.soldCount) || 0,
      affiliateUrl: payload.affiliateUrl || 'https://shopee.com.br',
      keywords: payload.keywords || [],
      isFeatured: Boolean(payload.isFeatured),
      isBestSeller: Boolean(payload.isBestSeller),
      isViral: Boolean(payload.isViral),
      isDailyDeal: Boolean(payload.isDailyDeal),
      isActive: payload.isActive !== false,
      createdAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
    };

    products.unshift(newProd);
    saveData();
    res.status(201).json(newProd);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Produto não encontrado' });

    products[idx] = { ...products[idx], ...req.body, id };
    saveData();
    res.json(products[idx]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== id);
    saveData();
    res.json({ success: true });
  });

  // API: CATEGORIES
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json(categories);
  });

  // API: ARTICLES
  app.get('/api/articles', (_req: Request, res: Response) => {
    res.json(articles);
  });

  app.get('/api/articles/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const art = articles.find(a => a.slug === slug || a.id === slug);
    if (!art) return res.status(404).json({ error: 'Artigo não encontrado' });
    res.json(art);
  });

  // API: CLICKS & REDIRECT
  app.post('/api/clicks', (req: Request, res: Response) => {
    const { productId, referrer } = req.body;
    const prod = products.find(p => p.id === productId);
    if (!prod) return res.status(404).json({ error: 'Produto não encontrado' });

    prod.clicks = (prod.clicks || 0) + 1;
    const clickLog: ClickLog = {
      id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      timestamp: new Date().toISOString(),
      referrer: referrer || req.get('referrer') || 'direct',
      device: req.get('user-agent')?.includes('Mobile') ? 'Mobile' : 'Desktop',
    };
    clicks.unshift(clickLog);
    if (clicks.length > 2000) clicks.pop();
    saveData();

    res.json({ success: true, affiliateUrl: prod.affiliateUrl });
  });

  // Dedicated redirect route for affiliate links
  app.get('/go/:slugOrId', (req: Request, res: Response) => {
    const { slugOrId } = req.params;
    const prod = products.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (!prod) {
      return res.redirect('/');
    }
    prod.clicks = (prod.clicks || 0) + 1;
    clicks.unshift({
      id: `clk-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      timestamp: new Date().toISOString(),
      referrer: req.get('referrer') || 'affiliate_redirect',
      device: req.get('user-agent')?.includes('Mobile') ? 'Mobile' : 'Desktop',
    });
    saveData();
    res.redirect(prod.affiliateUrl);
  });

  // API: STATS
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
    const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    const topProducts = [...products]
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 10);

    const categoryClicks: Record<string, number> = {};
    clicks.forEach(c => {
      categoryClicks[c.category] = (categoryClicks[c.category] || 0) + 1;
    });

    res.json({
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalViews,
      totalClicks,
      overallCTR,
      topProducts,
      categoryClicks,
      recentClicks: clicks.slice(0, 30),
    });
  });

  // SITEMAP.XML
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const staticPages = [
      '',
      '/mais-vendidos',
      '/ofertas',
      '/virais',
      '/produtos-ate-50',
      '/produtos-ate-100',
      '/melhores-produtos',
      '/blog',
      '/privacidade',
      '/termos',
      '/aviso-afiliado',
      '/cookies',
    ];

    const categoryUrls = categories.map(c => `/categoria/${c.slug}`);
    const productUrls = products.filter(p => p.isActive).map(p => `/produto/${p.slug}`);
    const articleUrls = articles.map(a => `/blog/${a.slug}`);

    const allUrls = [...staticPages, ...categoryUrls, ...productUrls, ...articleUrls];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    allUrls.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${url === '' ? '1.0' : url.startsWith('/produto') ? '0.8' : '0.6'}</priority>\n`;
      xml += `  </url>\n`;
    });
    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // ROBOTS.TXT
  app.get('/robots.txt', (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    res.send(txt);
  });

  // Vite integration in development
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Achadinhos Online] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
