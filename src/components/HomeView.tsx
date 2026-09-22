import React, { useState, useEffect, useMemo } from 'react';
import { Product, FilterState, Category } from '../types';
import { StorageService } from '../services/storage';
import { ApiClient } from '../services/api';
import { useNavigation } from '../context/NavigationContext';
import { HeroBanner } from './HeroBanner';
import { FilterBar } from './FilterBar';
import { ProductCard } from './ProductCard';
import { SEOHead, trackEvent } from './SEOHead';
import {
  Flame,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Gift,
  Coins,
  Search,
} from 'lucide-react';

interface HomeViewProps {
  specialView?:
    | 'home'
    | 'mais-vendidos'
    | 'ofertas'
    | 'virais'
    | 'produtos-ate-50'
    | 'produtos-ate-100'
    | 'melhores-produtos';
  categorySlug?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  specialView = 'home',
  categorySlug,
}) => {
  const { searchQuery, navigate, currentPath } = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    query: searchQuery || '',
    category: categorySlug || 'all',
    priceRange: specialView === 'produtos-ate-50' ? 'under50' : specialView === 'produtos-ate-100' ? 'under100' : 'all',
    sort: specialView === 'mais-vendidos' ? 'sales' : 'relevance',
    onlyBestSellers: specialView === 'mais-vendidos',
    onlyVirals: specialView === 'virais',
    onlyDeals: specialView === 'ofertas',
  });

  // Sync route changes to filter
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: searchQuery || '',
      category: categorySlug || 'all',
      priceRange: specialView === 'produtos-ate-50' ? 'under50' : specialView === 'produtos-ate-100' ? 'under100' : 'all',
      sort: specialView === 'mais-vendidos' ? 'sales' : prev.sort,
      onlyBestSellers: specialView === 'mais-vendidos',
      onlyVirals: specialView === 'virais',
      onlyDeals: specialView === 'ofertas',
    }));
  }, [specialView, categorySlug, searchQuery]);

  // Load products
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const prods = StorageService.getActiveProducts();
      const cats = StorageService.getCategories();
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter and Sort calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Search query
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Price range
    if (filters.priceRange === 'under50') {
      result = result.filter((p) => p.currentPrice <= 50);
    } else if (filters.priceRange === 'under100') {
      result = result.filter((p) => p.currentPrice <= 100);
    } else if (filters.priceRange === 'over100') {
      result = result.filter((p) => p.currentPrice > 100);
    }

    // Badges
    if (filters.onlyBestSellers) {
      result = result.filter((p) => p.isBestSeller);
    }
    if (filters.onlyVirals) {
      result = result.filter((p) => p.isViral);
    }
    if (filters.onlyDeals) {
      result = result.filter((p) => p.isDailyDeal);
    }

    // Sorting
    switch (filters.sort) {
      case 'sales':
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'priceAsc':
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'relevance':
      default:
        // Featured and viral first
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters]);

  // Curated collections for the home page
  const trendingProducts = useMemo(
    () => products.filter((p) => p.isFeatured || p.isViral).slice(0, 4),
    [products]
  );
  const bestSellers = useMemo(
    () => products.filter((p) => p.isBestSeller).slice(0, 4),
    [products]
  );
  const dailyDeals = useMemo(
    () => products.filter((p) => p.isDailyDeal).slice(0, 4),
    [products]
  );
  const under50Products = useMemo(
    () => products.filter((p) => p.currentPrice <= 50).slice(0, 4),
    [products]
  );

  // SEO Info depending on page
  const getSEOData = () => {
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      return {
        title: `${cat?.name || 'Categoria'} - Melhores Achadinhos Shopee`,
        description: `Confira os produtos mais vendidos e achadinhos com desconto na categoria ${cat?.name || ''} da Shopee Brasil.`,
      };
    }
    switch (specialView) {
      case 'mais-vendidos':
        return {
          title: 'Produtos Mais Vendidos da Shopee Brasil',
          description: 'Veja a lista atualizada dos produtos mais vendidos e bem avaliados da Shopee com ofertas imperdíveis.',
        };
      case 'ofertas':
        return {
          title: 'Ofertas do Dia e Descontos Relâmpago Shopee',
          description: 'Aproveite descontos de até 60% e cupons de frete grátis em achadinhos selecionados da Shopee.',
        };
      case 'virais':
        return {
          title: 'Achadinhos Virais do TikTok e Reels da Shopee',
          description: 'Descubra os produtos que estão bombando nas redes sociais com avaliações reais e links diretos.',
        };
      case 'produtos-ate-50':
        return {
          title: 'Achadinhos da Shopee por Menos de R$ 50',
          description: 'Garimpo especial de produtos úteis, baratos e inovadores da Shopee por até cinquenta reais.',
        };
      case 'produtos-ate-100':
        return {
          title: 'Ofertas da Shopee até R$ 100',
          description: 'Os melhores achadinhos e eletrônicos inteligentes da Shopee por menos de cem reais.',
        };
      case 'melhores-produtos':
        return {
          title: 'Os Melhores Produtos da Shopee em 2026',
          description: 'Curadoria com os produtos campeões de avaliação positiva e satisfação dos compradores.',
        };
      default:
        return {
          title: 'Achadinhos Online - Melhores Ofertas e Produtos Shopee',
          description: 'Portal independente de ofertas, achadinhos virais e produtos populares da Shopee Brasil com descontos imperdíveis e recomendações diárias.',
        };
    }
  };

  const seo = getSEOData();

  return (
    <div>
      <SEOHead title={seo.title} description={seo.description} />

      {/* Show Hero only on root Home */}
      {specialView === 'home' && !categorySlug && !searchQuery && <HeroBanner />}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dedicated Page Header if in specialized page */}
        {(specialView !== 'home' || categorySlug || searchQuery) && (
          <div className="mb-8 pb-6 border-b border-slate-200">
            <span className="text-xs font-bold text-[#EE4D2D] uppercase tracking-wider mb-1 block">
              Curadoria Achadinhos Online
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {searchQuery ? `Resultados para "${searchQuery}"` : seo.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{seo.description}</p>
          </div>
        )}

        {/* Section: 🔥 PRODUTOS EM ALTA (Only on Home without search query) */}
        {specialView === 'home' && !categorySlug && !searchQuery && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-orange-100 text-[#EE4D2D]">
                    <Flame className="w-5 h-5 fill-[#EE4D2D]" />
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    PRODUTOS EM ALTA
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Os achadinhos mais procurados e clicados da semana na Shopee
                </p>
              </div>

              <button
                onClick={() => navigate('/virais')}
                className="text-xs font-bold text-[#EE4D2D] hover:text-[#D73211] flex items-center gap-1 transition-colors"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
          totalCount={filteredProducts.length}
        />

        {/* Filtered Products Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
              {filters.query
                ? `Resultados encontrados (${filteredProducts.length})`
                : filters.category !== 'all'
                ? `Produtos em ${categories.find((c) => c.slug === filters.category)?.name || 'Categoria'}`
                : 'Todas as Ofertas e Recomendações'}
            </h3>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-display text-base font-bold text-slate-900 mb-1">
                Nenhum produto encontrado
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Não encontramos ofertas correspondentes aos filtros selecionados. Tente buscar por outros termos ou redefinir os filtros.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    query: '',
                    category: 'all',
                    priceRange: 'all',
                    sort: 'relevance',
                    onlyBestSellers: false,
                    onlyVirals: false,
                    onlyDeals: false,
                  })
                }
                className="px-4 py-2 bg-[#EE4D2D] text-white text-xs font-bold rounded-xl hover:bg-[#D73211] transition-colors"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>

        {/* Extra Specialized Sections on Default Home: ⚡ Ofertas do Dia & 🎁 Até R$ 50 */}
        {specialView === 'home' && !categorySlug && !searchQuery && (
          <>
            {/* ⚡ Ofertas do Dia */}
            <section className="mb-14 pt-8 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-100 text-amber-600">
                      <Zap className="w-5 h-5 fill-amber-500" />
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                      Ofertas Relâmpago do Dia
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preços especiais por tempo limitado no vendedor oficial
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ofertas')}
                  className="text-xs font-bold text-[#EE4D2D] hover:underline flex items-center gap-1"
                >
                  <span>Ver todas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {dailyDeals.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>

            {/* 🎁 Achadinhos até R$ 50 */}
            <section className="mb-14 pt-8 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-100 text-emerald-600">
                      <Gift className="w-5 h-5" />
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                      Achadinhos Baratinhos até R$ 50
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Utensílios práticos e novidades que cabem em qualquer bolso
                  </p>
                </div>
                <button
                  onClick={() => navigate('/produtos-ate-50')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Ver lista até R$ 50</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {under50Products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
