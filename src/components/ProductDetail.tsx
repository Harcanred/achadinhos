import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Flame,
  Zap,
} from 'lucide-react';
import { Product } from '../types';
import { StorageService } from '../services/storage';
import { ApiClient } from '../services/api';
import { useNavigation } from '../context/NavigationContext';
import { ProductCard } from './ProductCard';
import { SEOHead, trackEvent } from './SEOHead';

interface ProductDetailProps {
  slug: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
  const { navigate } = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function load() {
      const item = await ApiClient.getProduct(slug);
      if (isMounted) {
        setProduct(item);
        if (item) {
          setActiveImage(item.image);
          trackEvent('product_view', {
            product_id: item.id,
            product_name: item.name,
            category: item.category,
            price: item.currentPrice,
          });

          // Fetch related
          const all = await ApiClient.getProducts({ category: item.category });
          setRelatedProducts(all.filter((p) => p.id !== item.id).slice(0, 4));
        }
        setLoading(false);
      }
    }

    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#EE4D2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Produto não encontrado</h2>
        <p className="text-slate-600 mb-6 text-sm">
          Este produto pode ter expirado ou foi removido do nosso catálogo.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-[#EE4D2D] text-white font-semibold rounded-xl text-sm hover:bg-[#D73211] transition-colors"
        >
          Voltar para as Ofertas
        </button>
      </div>
    );
  }

  const handleBuyClick = async () => {
    trackEvent('affiliate_click', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.currentPrice,
    });
    try {
      await ApiClient.recordAffiliateClick(product.id, 'pdp_primary_button');
    } catch {}

    const url =
      product.affiliateUrl ||
      `https://shopee.com.br/search?keyword=${encodeURIComponent(product.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'facebook' | 'twitter' | 'copy') => {
    trackEvent('share_product', { product_id: product.id, platform });
    const text = `Olha esse achadinho que encontrei na Shopee com super desconto: ${product.name} por apenas ${StorageService.formatCurrency(product.currentPrice)}!`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${currentUrl}`)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const imagesList = [product.image, ...(product.gallery || [])].filter(
    (img, idx, arr) => arr.indexOf(img) === idx && Boolean(img)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <SEOHead
        title={`${product.name} com Desconto na Shopee`}
        description={product.shortDescription || product.description.slice(0, 160)}
        image={product.image}
        type="product"
        product={product}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <button
          onClick={() => navigate('/')}
          className="hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Início
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/categoria/${product.category}`)}
          className="hover:text-slate-900 transition-colors"
        >
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Grid: Gallery + Purchasing Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Showcase Image */}
          <div className="relative aspect-4/3 sm:aspect-4/3 w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#EE4D2D] text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
                -{product.discountPercent}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> MAIS VENDIDO
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                    activeImage === img
                      ? 'border-[#EE4D2D] shadow-md scale-95'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Share2 className="w-4 h-4 text-[#EE4D2D]" />
              <span>Compartilhe essa oferta:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold transition-colors"
                title="Compartilhar no Telegram"
              >
                Telegram
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                title="Compartilhar no X"
              >
                X
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                title="Copiar Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Purchasing & Information Module (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category and Metrics */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[#EE4D2D] uppercase tracking-wider">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-800 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-500 font-normal">({product.reviewCount} avaliações)</span>
                </div>
                <span>·</span>
                <span className="text-slate-600 font-medium">{product.soldCount.toLocaleString('pt-BR')} vendidos</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price Box */}
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-[#EE4D2D]/20">
              <div className="flex items-baseline gap-3">
                {product.previousPrice > product.currentPrice && (
                  <span className="text-sm text-slate-600 line-through tabular-nums">
                    De: {StorageService.formatCurrency(product.previousPrice)}
                  </span>
                )}
                <span className="text-3xl sm:text-4xl font-black text-[#EE4D2D] tabular-nums tracking-tight">
                  {StorageService.formatCurrency(product.currentPrice)}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Economize {product.discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Preço sujeito a alteração e cupons de frete grátis disponíveis no aplicativo da Shopee.
              </p>
            </div>

            {/* Target Audience Highlight */}
            {product.targetAudience && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1">
                  🎯 Para quem este produto é indicado:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.targetAudience}
                </p>
              </div>
            )}

            {/* Big Affiliate CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleBuyClick}
                className="w-full py-4 px-6 text-base sm:text-lg font-black text-white bg-[#EE4D2D] hover:bg-[#D73211] active:scale-[0.99] rounded-2xl transition-all shadow-lg shadow-[#EE4D2D]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.4]" />
                <span>VER PREÇO NA SHOPEE</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleBuyClick}
                className="w-full py-3 px-6 text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>COMPRAR NA LOJA OFICIAL DA SHOPEE</span>
              </button>
            </div>

            {/* Shopee Affiliate Transparency Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Aviso importante de afiliado:</p>
                <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                  Você será direcionado para a Shopee para verificar o preço atualizado, cupons e finalizar sua compra. Não realizamos vendas diretas nem cobramos valores neste site.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100">
                <Truck className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Frete grátis conforme regras da Shopee</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100">
                <RotateCcw className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Garantia Shopee e devolução fácil</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Information Section */}
      <div className="mt-12 pt-10 border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Full Description & Benefits (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
              Descrição Completa do Produto
            </h2>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Principais Benefícios
              </h3>
              <ul className="space-y-3">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Specifications Table (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="font-display text-base font-bold text-slate-900 mb-4">
              Especificações Técnicas
            </h3>
            {product.specs && product.specs.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between gap-4">
                    <span className="font-medium text-slate-500">{s.label}</span>
                    <span className="text-right text-slate-800 font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Consulte mais especificações na página oficial do produto na Shopee.
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBuyClick}
                className="w-full py-2.5 text-xs font-bold text-[#EE4D2D] hover:text-[#D73211] bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center block"
              >
                Conferir mais detalhes na Shopee →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products: "Você também pode gostar" */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Você também pode gostar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mais achadinhos populares em {product.categoryName}
              </p>
            </div>
            <button
              onClick={() => navigate(`/categoria/${product.category}`)}
              className="text-xs font-semibold text-[#EE4D2D] hover:underline"
            >
              Ver todos da categoria →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
