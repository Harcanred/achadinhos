-- ============================================================
-- ACHADINHOS ONLINE - ESQUEMA DE BANCO DE DADOS SUPABASE / POSTGRESQL
-- ============================================================

-- 1. TABELA DE CATEGORIAS (categories)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE PRODUTOS (products)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || floor(extract(epoch from now()))),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '[]'::jsonb,
  target_audience TEXT,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  current_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  previous_price NUMERIC(10,2) DEFAULT 0.00,
  discount_percent INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  affiliate_url TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_viral BOOLEAN DEFAULT false,
  is_daily_deal BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE CLIQUES DE AFILIADO (clicks)
CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY DEFAULT ('clk-' || floor(extract(epoch from now()))),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  referrer TEXT,
  device TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE ARTIGOS DO BLOG (articles)
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY DEFAULT ('art-' || floor(extract(epoch from now()))),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  read_time TEXT DEFAULT '4 min de leitura',
  author TEXT DEFAULT 'Equipe Achadinhos Online',
  featured_product_ids JSONB DEFAULT '[]'::jsonb,
  published_at DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (Anônimo pode ler produtos ativos e categorias)
CREATE POLICY "Permitir leitura pública de produtos ativos" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir leitura pública de categorias" ON categories FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de artigos" ON articles FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de cliques de afiliado" ON clicks FOR INSERT WITH CHECK (true);
