import React, { useState, useEffect } from 'react';
import { Article, Product } from '../types';
import { StorageService } from '../services/storage';
import { ApiClient } from '../services/api';
import { useNavigation } from '../context/NavigationContext';
import { ProductCard } from './ProductCard';
import { SEOHead } from './SEOHead';
import { Sparkles, Calendar, Clock, ArrowLeft, ArrowRight, User } from 'lucide-react';

interface BlogViewProps {
  articleSlug?: string;
}

export const BlogView: React.FC<BlogViewProps> = ({ articleSlug }) => {
  const { navigate } = useNavigation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const list = StorageService.getArticles();
    setArticles(list);

    if (articleSlug) {
      const art = StorageService.getArticleBySlug(articleSlug);
      setCurrentArticle(art || null);
      if (art && art.featuredProductIds) {
        const prods = StorageService.getProducts().filter((p) =>
          art.featuredProductIds.includes(p.id)
        );
        setFeaturedProducts(prods);
      }
    } else {
      setCurrentArticle(null);
    }
  }, [articleSlug]);

  if (articleSlug && currentArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SEOHead
          title={currentArticle.title}
          description={currentArticle.excerpt}
          image={currentArticle.coverImage}
          type="article"
        />

        {/* Back Link */}
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o Blog
        </button>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GUIA DE COMPRAS SHOPEE</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {currentArticle.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-600" />
              {currentArticle.author}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              {new Date(currentArticle.publishedAt).toLocaleDateString('pt-BR')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              {currentArticle.readTime}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-16/9 rounded-3xl overflow-hidden mb-8 border border-slate-200/80 shadow-xs">
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-700 whitespace-pre-line mb-12">
          {currentArticle.content}
        </div>

        {/* Embedded Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="bg-orange-50/40 rounded-3xl p-6 sm:p-8 border border-orange-200/60 mt-8 mb-12">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              Produtos Mencionados neste Artigo
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              Aproveite os links oficiais com cupons e garanta seu achadinho com preço especial:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3">
          <h3 className="font-display text-lg font-bold">Gostou das dicas de achadinhos?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Acesse nosso catálogo completo com centenas de ofertas verificadas diariamente.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Explorar Todas as Ofertas da Shopee
          </button>
        </div>
      </div>
    );
  }

  // Articles List View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEOHead
        title="Blog de Achadinhos e Ofertas Shopee"
        description="Guias de compras, dicas de produtos virais do TikTok e seleções de achadinhos da Shopee por menos de R$ 50."
      />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-[#EE4D2D] uppercase tracking-wider mb-2 block">
          Dicas & Curadoria
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Blog de Achadinhos Shopee
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Análises honestas, comparações e seleções de produtos que valem o investimento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.id}
            onClick={() => navigate(`/blog/${art.slug}`)}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#EE4D2D]/30 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-2">
                  <span>{new Date(art.publishedAt).toLocaleDateString('pt-BR')}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#EE4D2D] transition-colors leading-snug">
                  {art.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <span className="text-xs font-bold text-[#EE4D2D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ler artigo completo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
