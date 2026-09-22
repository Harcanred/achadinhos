import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProductDetail } from './components/ProductDetail';
import { BlogView } from './components/BlogView';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalPages } from './components/LegalPages';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CookieConsent } from './components/CookieConsent';

function AppContent() {
  const { currentPath, params } = useNavigation();

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Individual Product Page: /produto/:slug
    if (currentPath.startsWith('/produto/') && params.slug) {
      return <ProductDetail slug={params.slug} />;
    }

    // 2. Category Pages: /categoria/:category
    if (currentPath.startsWith('/categoria/') && params.category) {
      return <HomeView categorySlug={params.category} />;
    }

    // Direct Category shortcuts (e.g. /tecnologia, /casa, /ferramentas, etc.)
    const directCategories = [
      'tecnologia',
      'casa',
      'ferramentas',
      'automotivo',
      'moda',
      'beleza',
      'achadinhos',
    ];
    const pathNoSlash = currentPath.replace('/', '');
    if (directCategories.includes(pathNoSlash)) {
      return <HomeView categorySlug={pathNoSlash} />;
    }

    // 3. Specialized SEO Pages
    if (currentPath === '/mais-vendidos') {
      return <HomeView specialView="mais-vendidos" />;
    }
    if (currentPath === '/ofertas') {
      return <HomeView specialView="ofertas" />;
    }
    if (currentPath === '/virais') {
      return <HomeView specialView="virais" />;
    }
    if (currentPath === '/produtos-ate-50') {
      return <HomeView specialView="produtos-ate-50" />;
    }
    if (currentPath === '/produtos-ate-100') {
      return <HomeView specialView="produtos-ate-100" />;
    }
    if (currentPath === '/melhores-produtos') {
      return <HomeView specialView="melhores-produtos" />;
    }

    // 4. Blog & Articles: /blog or /blog/:slug
    if (currentPath === '/blog') {
      return <BlogView />;
    }
    if (currentPath.startsWith('/blog/') && params.articleSlug) {
      return <BlogView articleSlug={params.articleSlug} />;
    }

    // 5. Admin Panel
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }

    // 6. Legal & LGPD Compliance Pages
    if (currentPath === '/privacidade') {
      return <LegalPages pageType="privacidade" />;
    }
    if (currentPath === '/termos') {
      return <LegalPages pageType="termos" />;
    }
    if (currentPath === '/cookies') {
      return <LegalPages pageType="cookies" />;
    }
    if (currentPath === '/aviso-afiliado') {
      return <LegalPages pageType="aviso-afiliado" />;
    }

    // Default: Homepage
    return <HomeView specialView="home" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      <Header />
      <main className="flex-1">{renderRoute()}</main>
      <Footer />
      <FloatingWhatsApp />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
