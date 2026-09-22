import React, { useEffect } from 'react';
import { Product } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: Product;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Achadinhos Online - Melhores Ofertas e Produtos Shopee',
  description = 'Portal independente de ofertas, achadinhos virais e produtos populares da Shopee Brasil com descontos imperdíveis e recomendações diárias.',
  image = '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
  url = window.location.href,
  type = 'website',
  product,
}) => {
  useEffect(() => {
    // Title
    const formattedTitle = title.includes('Achadinhos Online')
      ? title
      : `${title} | Achadinhos Online`;
    document.title = formattedTitle;

    // Meta tags update
    const updateMeta = (nameOrProperty: string, content: string) => {
      let element =
        document.querySelector(`meta[name="${nameOrProperty}"]`) ||
        document.querySelector(`meta[property="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (nameOrProperty.startsWith('og:')) {
          element.setAttribute('property', nameOrProperty);
        } else {
          element.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', formattedTitle);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', url);
    updateMeta('og:type', type);
    updateMeta('twitter:title', formattedTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Schema.org JSON-LD
    const scriptId = 'json-ld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    if (product) {
      const productSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: [product.image, ...product.gallery],
        description: product.description || product.shortDescription,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'Shopee',
        },
        offers: {
          '@type': 'Offer',
          url: url,
          priceCurrency: 'BRL',
          price: product.currentPrice.toFixed(2),
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Shopee Brasil',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: product.reviewCount.toString(),
          bestRating: '5',
          worstRating: '1',
        },
      };
      script.textContent = JSON.stringify(productSchema);
    } else {
      const siteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Achadinhos Online',
        url: window.location.origin,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };
      script.textContent = JSON.stringify(siteSchema);
    }
  }, [title, description, image, url, type, product]);

  return null;
};

// Analytics Tracker Helper
export const trackEvent = (
  eventName: 'product_view' | 'affiliate_click' | 'category_view' | 'search' | 'share_product',
  params: Record<string, unknown>
) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4 push
    if ((window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: eventName,
        ...params,
      });
    }
    // Meta Pixel push
    if (typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === 'function') {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('trackCustom', eventName, params);
    }
  }
};
