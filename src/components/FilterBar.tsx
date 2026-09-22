import React from 'react';
import { FilterState, SortOption, PriceFilter, Category } from '../types';
import { Flame, Zap, TrendingUp, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  categories: Category[];
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  categories,
  totalCount,
}) => {
  const handleCategoryChange = (slug: string) => {
    onChange({ ...filters, category: slug });
  };

  const handlePriceChange = (range: PriceFilter) => {
    onChange({ ...filters, priceRange: range });
  };

  const handleSortChange = (sort: SortOption) => {
    onChange({ ...filters, sort });
  };

  const toggleFilter = (key: 'onlyBestSellers' | 'onlyVirals' | 'onlyDeals') => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.onlyBestSellers ||
    filters.onlyVirals ||
    filters.onlyDeals ||
    filters.query !== '';

  const resetFilters = () => {
    onChange({
      query: '',
      category: 'all',
      priceRange: 'all',
      sort: 'relevance',
      onlyBestSellers: false,
      onlyVirals: false,
      onlyDeals: false,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8 space-y-4">
      {/* Top Bar: Title, Count, Sort Selector & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#EE4D2D]" />
          <h2 className="text-sm font-bold text-slate-800">
            Filtrar e Ordenar Achadinhos
          </h2>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            {totalCount} {totalCount === 1 ? 'produto' : 'produtos'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="hidden sm:inline">Ordenar:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="text-xs font-semibold bg-slate-100 text-slate-800 rounded-xl px-3 py-1.5 border-none focus:ring-2 focus:ring-[#EE4D2D]/20 outline-none cursor-pointer"
            >
              <option value="relevance">Mais Relevantes</option>
              <option value="sales">Mais Vendidos</option>
              <option value="priceAsc">Menor Preço</option>
              <option value="priceDesc">Maior Preço</option>
              <option value="discount">Maior Desconto</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="newest">Mais Recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Categorias
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              filters.category === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas as Categorias
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.slug)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filters.category === c.slug
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price and Feature Flags Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Price Range */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Faixa de Preço:
          </span>
          <button
            onClick={() => handlePriceChange('all')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              filters.priceRange === 'all'
                ? 'bg-[#EE4D2D] text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handlePriceChange('under50')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              filters.priceRange === 'under50'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Até R$ 50
          </button>
          <button
            onClick={() => handlePriceChange('under100')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              filters.priceRange === 'under100'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Até R$ 100
          </button>
          <button
            onClick={() => handlePriceChange('over100')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              filters.priceRange === 'over100'
                ? 'bg-slate-800 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Acima de R$ 100
          </button>
        </div>

        {/* Badges Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => toggleFilter('onlyBestSellers')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filters.onlyBestSellers
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Flame className="w-3 h-3 text-[#EE4D2D]" />
            Mais Vendidos
          </button>

          <button
            onClick={() => toggleFilter('onlyVirals')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filters.onlyVirals
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            Virais
          </button>

          <button
            onClick={() => toggleFilter('onlyDeals')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filters.onlyDeals
                ? 'bg-[#EE4D2D] text-white font-bold'
                : 'bg-orange-50 text-orange-900 hover:bg-orange-100'
            }`}
          >
            <Zap className="w-3 h-3" />
            Ofertas do Dia
          </button>
        </div>
      </div>
    </div>
  );
};
