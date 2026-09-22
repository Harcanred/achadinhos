import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ShoppingBag,
  Flame,
  Zap,
  TrendingUp,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storage';
import { Product } from '../types';

export const Header: React.FC = () => {
  const { currentPath, navigate, searchQuery, setSearchQuery } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const categories = StorageService.getCategories();

  // Handle instant search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      const all = StorageService.getActiveProducts();
      const matched = all
        .filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.keywords.some(k => k.toLowerCase().includes(q))
        )
        .slice(0, 5);
      setSuggestions(matched);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setShowSuggestions(false);
    navigate(`/produto/${product.slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-[#EE4D2D] via-[#F26440] to-[#EE4D2D] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-300" />
          <span>Os melhores achadinhos e cupons verificados da Shopee Brasil · Atualizado hoje!</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EE4D2D] flex items-center justify-center text-white shadow-sm shadow-[#EE4D2D]/30 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                  Achadinhos<span className="text-[#EE4D2D]">Online</span>
                </span>
                <span className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">
                  Portal de Ofertas Shopee
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar - Center Desktop */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Busque produtos e ofertas (ex: air fryer, furadeira, fone)..."
                className="w-full h-10 pl-11 pr-24 text-sm bg-slate-100/90 text-slate-900 rounded-full border border-transparent focus:border-[#EE4D2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/20 transition-all placeholder:text-slate-600"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold text-white bg-[#EE4D2D] hover:bg-[#D73211] rounded-full transition-colors shadow-sm"
              >
                Buscar
              </button>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600 px-3">
                  <span className="font-semibold text-slate-700">Sugestões de Produtos</span>
                  <span>{suggestions.length} encontrados</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {suggestions.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectSuggestion(p)}
                      className="p-3 hover:bg-orange-50/60 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600">
                          <span className="text-[#EE4D2D] font-bold">
                            {StorageService.formatCurrency(p.currentPrice)}
                          </span>
                          <span>·</span>
                          <span className="line-through text-slate-600">
                            {StorageService.formatCurrency(p.previousPrice)}
                          </span>
                          <span>·</span>
                          <span className="text-emerald-600 font-medium">-{p.discountPercent}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-2 px-3 text-center text-xs font-medium text-[#EE4D2D] hover:bg-orange-50 bg-slate-50 border-t border-slate-100 transition-colors"
                >
                  Ver todos os resultados para "{searchQuery}"
                </button>
              </div>
            )}
          </div>

          {/* Right Action zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/virais')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentPath === '/virais'
                  ? 'bg-orange-500/10 text-[#EE4D2D]'
                  : 'text-slate-700 hover:text-[#EE4D2D] hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Virais TikTok</span>
            </button>

            <button
              onClick={() => navigate('/mais-vendidos')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentPath === '/mais-vendidos'
                  ? 'bg-orange-500/10 text-[#EE4D2D]'
                  : 'text-slate-700 hover:text-[#EE4D2D] hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#EE4D2D]" />
              <span>Mais Vendidos</span>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Acesso Administrativo"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Painel</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busque produtos e ofertas..."
              className="w-full h-9 pl-9 pr-18 text-xs bg-slate-100 text-slate-900 rounded-full border border-transparent focus:border-[#EE4D2D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]"
            />
            <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-[11px] font-semibold text-white bg-[#EE4D2D] rounded-full"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Categories Horizontal Navigation Bar */}
      <nav className="border-t border-slate-100 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-medium whitespace-nowrap">
            <button
              onClick={() => navigate('/')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                currentPath === '/'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => navigate('/mais-vendidos')}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                currentPath === '/mais-vendidos'
                  ? 'bg-[#EE4D2D] text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              Mais Vendidos
            </button>

            <button
              onClick={() => navigate('/ofertas')}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                currentPath === '/ofertas'
                  ? 'bg-[#EE4D2D] text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              Ofertas do Dia
            </button>

            <button
              onClick={() => navigate('/virais')}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                currentPath === '/virais'
                  ? 'bg-[#EE4D2D] text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3 h-3 text-purple-500" />
              Virais
            </button>

            <button
              onClick={() => navigate('/produtos-ate-50')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                currentPath === '/produtos-ate-50'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Até R$ 50
            </button>

            <button
              onClick={() => navigate('/produtos-ate-100')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                currentPath === '/produtos-ate-100'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Até R$ 100
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/categoria/${cat.slug}`)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  currentPath === `/categoria/${cat.slug}`
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

            <button
              onClick={() => navigate('/blog')}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                currentPath.startsWith('/blog')
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Blog de Dicas
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-slate-900/40 backdrop-blur-xs z-50">
          <div className="bg-white h-full max-w-xs p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Navegação Rápida
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Início</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigate('/mais-vendidos');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#EE4D2D]" /> Mais Vendidos
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigate('/ofertas');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Ofertas do Dia
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigate('/virais');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" /> Virais TikTok & Reels
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigate('/produtos-ate-50');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Achadinhos até R$ 50</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigate('/produtos-ate-100');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Ofertas até R$ 100</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    navigate('/blog');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Blog de Recomendações</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Categorias
                </div>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigate(`/categoria/${c.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Acessar Painel Administrativo
              </button>
              <p className="text-[10px] text-slate-600 text-center">
                Achadinhos Online · Portal Independente
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
