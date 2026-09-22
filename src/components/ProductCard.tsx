import React, { useState } from 'react';
import { Star, ShoppingBag, ExternalLink, Flame, Zap, TrendingUp, Share2, Check } from 'lucide-react';
import { Product } from '../types';
import { StorageService } from '../services/storage';
import { ApiClient } from '../services/api';
import { useNavigation } from '../context/NavigationContext';
import { trackEvent } from './SEOHead';

interface ProductCardProps {
  product: Product;
  onShare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onShare }) => {
  const { navigate } = useNavigation();
  const [imgError, setImgError] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRedirecting(true);

    // Track event
    trackEvent('affiliate_click', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.currentPrice,
    });

    try {
      await ApiClient.recordAffiliateClick(product.id, 'card_button');
    } catch {
      // ignore
    }

    // Direct to Shopee in new tab
    const url = product.affiliateUrl || `https://shopee.com.br/search?keyword=${encodeURIComponent(product.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsRedirecting(false);
  };

  const handleCardClick = () => {
    navigate(`/produto/${product.slug}`);
  };

  const handleQuickShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(product);
      return;
    }
    const shareUrl = `${window.location.origin}/produto/${product.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedSales =
    product.soldCount >= 1000
      ? `${(product.soldCount / 1000).toFixed(1).replace('.0', '')}k`
      : product.soldCount;

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#EE4D2D]/30 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Visual Container */}
      <div className="relative aspect-4/3 sm:aspect-square bg-slate-50 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-600 mb-2" />
            <span className="text-xs font-semibold text-slate-700 line-clamp-2">{product.name}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPercent > 0 && (
            <span className="bg-[#EE4D2D] text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" />
              MAIS VENDIDO
            </span>
          )}
          {product.isViral && !product.isBestSeller && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              VIRAL
            </span>
          )}
        </div>

        {/* Quick Share Button */}
        <button
          onClick={handleQuickShare}
          title="Compartilhar produto"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-[#EE4D2D] hover:bg-white shadow-sm flex items-center justify-center transition-colors z-10"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>

        {/* Sales Tag if High */}
        {product.soldCount > 500 && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">
            {formattedSales} vendidos
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span className="font-medium text-[#EE4D2D]">{product.categoryName}</span>
            <div className="flex items-center gap-1 text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-slate-600">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#EE4D2D] transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Area */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            {product.previousPrice > product.currentPrice && (
              <span className="text-xs text-slate-600 line-through tabular-nums">
                {StorageService.formatCurrency(product.previousPrice)}
              </span>
            )}
            <span className="text-lg sm:text-xl font-extrabold text-[#EE4D2D] tabular-nums tracking-tight">
              {StorageService.formatCurrency(product.currentPrice)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              onClick={handleCardClick}
              className="py-2 px-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center truncate"
            >
              VER OFERTA
            </button>

            <button
              type="button"
              onClick={handleBuyClick}
              disabled={isRedirecting}
              className="py-2 px-2 text-xs font-bold text-white bg-[#EE4D2D] hover:bg-[#D73211] active:scale-[0.98] rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 text-center truncate"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>COMPRAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
