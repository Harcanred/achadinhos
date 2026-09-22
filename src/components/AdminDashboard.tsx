import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Copy,
  TrendingUp,
  Eye,
  MousePointerClick,
  Percent,
  Search,
  CheckCircle,
  XCircle,
  LogOut,
  Save,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Flame,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Product, Category, Article } from '../types';
import { StorageService } from '../services/storage';
import { ApiClient } from '../services/api';
import { useNavigation } from '../context/NavigationContext';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'articles' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('all');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'achadinhos',
    categoryName: 'Achadinhos Virais',
    shortDescription: '',
    description: '',
    benefits: '',
    specs: '',
    targetAudience: '',
    image: '',
    gallery: '',
    currentPrice: '',
    previousPrice: '',
    discountPercent: '',
    rating: '4.8',
    reviewCount: '100',
    soldCount: '1000',
    affiliateUrl: '',
    keywords: '',
    isFeatured: false,
    isBestSeller: false,
    isViral: false,
    isDailyDeal: false,
    isActive: true,
  });

  // Settings State
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    setIsAuthenticated(StorageService.isAdminLoggedIn());
    loadAllData();
  }, []);

  const loadAllData = () => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setArticles(StorageService.getArticles());
    setStats(StorageService.getAnalyticsSummary());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (StorageService.verifyAdminLogin(passwordInput)) {
      setIsAuthenticated(true);
      setLoginError('');
      loadAllData();
    } else {
      setLoginError('Senha incorreta. A senha padrão é "admin123"');
    }
  };

  const handleLogout = () => {
    StorageService.adminLogout();
    setIsAuthenticated(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.slug || 'achadinhos',
      categoryName: categories[0]?.name || 'Achadinhos Virais',
      shortDescription: '',
      description: '',
      benefits: 'Prático e fácil de usar\nExcelente custo-benefício\nEnvio rápido e seguro',
      specs: 'Material: Alta qualidade\nGarantia: Shopee Oficial',
      targetAudience: 'Pessoas que buscam praticidade e economia no dia a dia.',
      image: '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
      gallery: '',
      currentPrice: '29.90',
      previousPrice: '59.90',
      discountPercent: '50',
      rating: '4.9',
      reviewCount: '500',
      soldCount: '2500',
      affiliateUrl: 'https://shopee.com.br',
      keywords: 'shopee, achadinho, oferta, viral',
      isFeatured: true,
      isBestSeller: false,
      isViral: true,
      isDailyDeal: true,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      categoryName: p.categoryName,
      shortDescription: p.shortDescription,
      description: p.description,
      benefits: (p.benefits || []).join('\n'),
      specs: (p.specs || []).map((s) => `${s.label}: ${s.value}`).join('\n'),
      targetAudience: p.targetAudience || '',
      image: p.image,
      gallery: (p.gallery || []).join('\n'),
      currentPrice: String(p.currentPrice),
      previousPrice: String(p.previousPrice),
      discountPercent: String(p.discountPercent),
      rating: String(p.rating),
      reviewCount: String(p.reviewCount),
      soldCount: String(p.soldCount),
      affiliateUrl: p.affiliateUrl,
      keywords: (p.keywords || []).join(', '),
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isViral: p.isViral,
      isDailyDeal: p.isDailyDeal,
      isActive: p.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategory = categories.find((c) => c.slug === formData.category);
    const benefitsArray = formData.benefits
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);
    const specsArray = formData.specs
      .split('\n')
      .map((line) => {
        const [label, ...rest] = line.split(':');
        return { label: label?.trim() || '', value: rest.join(':').trim() || '' };
      })
      .filter((s) => s.label && s.value);
    const galleryArray = formData.gallery
      .split('\n')
      .map((g) => g.trim())
      .filter(Boolean);
    const keywordsArray = formData.keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const curPrice = parseFloat(formData.currentPrice.replace(',', '.')) || 0;
    const prevPrice = parseFloat(formData.previousPrice.replace(',', '.')) || 0;
    let disc = parseInt(formData.discountPercent, 10) || 0;
    if (prevPrice > curPrice && !disc) {
      disc = Math.round(((prevPrice - curPrice) / prevPrice) * 100);
    }

    const payload = {
      name: formData.name,
      slug: StorageService.generateSlug(formData.name),
      category: formData.category,
      categoryName: selectedCategory?.name || formData.categoryName,
      shortDescription: formData.shortDescription,
      description: formData.description,
      benefits: benefitsArray,
      specs: specsArray,
      targetAudience: formData.targetAudience,
      image: formData.image || '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
      gallery: galleryArray.length > 0 ? galleryArray : [formData.image],
      currentPrice: curPrice,
      previousPrice: prevPrice,
      discountPercent: disc,
      rating: parseFloat(formData.rating) || 5.0,
      reviewCount: parseInt(formData.reviewCount, 10) || 0,
      soldCount: parseInt(formData.soldCount, 10) || 0,
      affiliateUrl: formData.affiliateUrl || 'https://shopee.com.br',
      keywords: keywordsArray,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isViral: formData.isViral,
      isDailyDeal: formData.isDailyDeal,
      isActive: formData.isActive,
    };

    if (editingProduct) {
      StorageService.updateProduct(editingProduct.id, payload);
    } else {
      StorageService.addProduct(payload);
    }

    setIsModalOpen(false);
    loadAllData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      StorageService.deleteProduct(id);
      loadAllData();
    }
  };

  const handleDuplicate = (id: string) => {
    StorageService.duplicateProduct(id);
    loadAllData();
  };

  const handleToggleActive = (id: string) => {
    StorageService.toggleProductStatus(id);
    loadAllData();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }
    StorageService.changeAdminPassword(newPassword);
    setPasswordSuccess('Senha de administrador atualizada com sucesso!');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleDownloadFullProjectZip = async () => {
    try {
      setDownloadingZip(true);
      const res = await fetch('/project_bundle.json');
      if (!res.ok) throw new Error('Falha ao carregar pacote do projeto');
      const data = await res.json();
      
      const byteCharacters = atob(data.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/zip' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'achadinhos-shopee-completo.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar ZIP:', err);
      alert('Não foi possível gerar o download direto. Tente novamente.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleExportBackup = () => {
    const json = StorageService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `achadinhos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (StorageService.importBackupJSON(content)) {
        alert('Dados importados com sucesso!');
        loadAllData();
      } else {
        alert('Erro ao importar arquivo JSON. Formato inválido.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !adminSearch ||
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(adminSearch.toLowerCase());
    const matchCat = adminCategory === 'all' || p.category === adminCategory;
    return matchSearch && matchCat;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EE4D2D]/10 text-[#EE4D2D] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Acesso restrito para gerenciamento de produtos, categorias e links de afiliado.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Senha de Acesso:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite sua senha..."
                className="w-full px-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D] focus:ring-2 focus:ring-[#EE4D2D]/20 transition-all"
                required
              />
              <p className="text-[11px] text-slate-600 mt-1">
                (Senha padrão inicial: <span className="font-semibold text-slate-700">admin123</span>)
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-[#EE4D2D]/20"
            >
              Entrar no Painel
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-6 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            ← Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#EE4D2D] text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
              Painel de Controle
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gerenciamento de produtos, links de afiliados Shopee e métricas de conversão.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-[#EE4D2D] text-[#EE4D2D]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Produtos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-[#EE4D2D] text-[#EE4D2D]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Métricas & Cliques
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'border-[#EE4D2D] text-[#EE4D2D]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Configurações & Backup
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="mt-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">Total de Produtos</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">{products.length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">Produtos Ativos</span>
              <span className="text-2xl font-black text-emerald-600 tabular-nums">
                {products.filter((p) => p.isActive).length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">Total de Visualizações</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {stats?.totalViews || 0}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">Cliques no Afiliado</span>
              <span className="text-2xl font-black text-[#EE4D2D] tabular-nums">
                {stats?.totalClicks || 0}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Pesquisar produto no painel..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-[#EE4D2D]/20 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={adminCategory}
                onChange={(e) => setAdminCategory(e.target.value)}
                className="text-xs font-semibold bg-slate-100 text-slate-800 rounded-xl px-3 py-2 border-none outline-none"
              >
                <option value="all">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={loadAllData}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Recarregar dados"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Produto</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4 text-center">Badges</th>
                    <th className="p-4 text-center">Cliques / CTR</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => {
                    const ctr =
                      prod.views > 0
                        ? (((prod.clicks || 0) / prod.views) * 100).toFixed(1)
                        : '0.0';
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                              <a
                                href={`/produto/${prod.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-[#EE4D2D] hover:underline flex items-center gap-1 mt-0.5"
                              >
                                Ver no site <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{prod.categoryName}</td>
                        <td className="p-4">
                          <span className="font-black text-slate-900 tabular-nums">
                            {StorageService.formatCurrency(prod.currentPrice)}
                          </span>
                          {prod.previousPrice > prod.currentPrice && (
                            <span className="block text-[10px] text-slate-600 line-through tabular-nums">
                              {StorageService.formatCurrency(prod.previousPrice)}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            {prod.isBestSeller && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                TOP
                              </span>
                            )}
                            {prod.isViral && (
                              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                VIRAL
                              </span>
                            )}
                            {prod.isDailyDeal && (
                              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                OFERTA
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-[#EE4D2D] tabular-nums">
                            {prod.clicks || 0}
                          </span>
                          <span className="text-slate-600 block text-[10px]">
                            {prod.views || 0} views ({ctr}%)
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleActive(prod.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                              prod.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {prod.isActive ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Editar Produto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(prod.id)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Duplicar Produto"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                        Nenhum produto encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & CLICKS */}
      {activeTab === 'analytics' && stats && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Taxa Média de Conversão (CTR)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#EE4D2D] tabular-nums">
                  {stats.overallCTR}%
                </span>
                <span className="text-xs text-slate-600">de cliques por visualização</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Total de Cliques de Afiliado
              </span>
              <span className="text-4xl font-black text-slate-900 tabular-nums">
                {stats.totalClicks}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Total de Visualizações de Página
              </span>
              <span className="text-4xl font-black text-slate-900 tabular-nums">
                {stats.totalViews}
              </span>
            </div>
          </div>

          {/* Top Converting Products Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#EE4D2D]" />
              Produtos Mais Clicados (Top Conversão)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="p-3">Posição / Produto</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3 text-center">Visualizações</th>
                    <th className="p-3 text-center">Cliques no Link</th>
                    <th className="p-3 text-center">CTR %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.topProducts.map((p: Product, index: number) => {
                    const ctr =
                      p.views > 0 ? (((p.clicks || 0) / p.views) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={p.id}>
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-black">
                            {index + 1}
                          </span>
                          <span className="truncate max-w-sm">{p.name}</span>
                        </td>
                        <td className="p-3 text-slate-600">{p.categoryName}</td>
                        <td className="p-3 text-center font-bold text-slate-800 tabular-nums">
                          {p.views || 0}
                        </td>
                        <td className="p-3 text-center font-black text-[#EE4D2D] tabular-nums">
                          {p.clicks || 0}
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-700 tabular-nums">
                          {ctr}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Click Logs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-display text-base font-bold text-slate-900 mb-3">
              Últimos Cliques Registrados
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {stats.recentClicks.length > 0 ? (
                stats.recentClicks.map((c: any) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{c.productName}</p>
                      <span className="text-[11px] text-slate-600">
                        Dispositivo: {c.device || 'Web'} · Origem: {c.referrer}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium tabular-nums">
                      {new Date(c.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4">Nenhum clique registrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & BACKUP */}
      {activeTab === 'settings' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Change Admin Password */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#EE4D2D]" />
              Alterar Senha do Administrador
            </h2>
            <p className="text-xs text-slate-600">
              Personalize sua senha para manter o painel administrativo protegido contra acessos não autorizados.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nova Senha:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres..."
                  className="w-full px-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  required
                />
              </div>

              {passwordSuccess && (
                <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2.5 rounded-xl">
                  {passwordSuccess}
                </p>
              )}

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Salvar Nova Senha
              </button>
            </form>
          </div>

          {/* Backup & Restore */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              Backup & Download do Projeto
            </h2>
            <p className="text-xs text-slate-600">
              Baixe os arquivos de código-fonte completos do site para enviar ao GitHub ou hospedar na Vercel, além de exportar dados em JSON.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownloadFullProjectZip}
                disabled={downloadingZip}
                className="w-full py-3 px-4 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
              >
                <Download className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
                <span>{downloadingZip ? 'Preparando arquivo ZIP...' : 'Baixar Projeto Completo (.ZIP)'}</span>
              </button>

              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Dados dos Produtos (JSON)</span>
              </button>

              <label className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
                <Upload className="w-4 h-4" />
                <span>Restaurar / Importar Backup JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="font-display text-xl font-bold text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Fone Bluetooth 5.3 com Display Digital"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  required
                />
              </div>

              {/* Category & Affiliate URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const c = categories.find((cat) => cat.slug === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryName: c?.name || '',
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link de Afiliado Shopee (affiliate_url) *
                  </label>
                  <input
                    type="url"
                    value={formData.affiliateUrl}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    placeholder="https://shope.ee/... ou link de busca Shopee"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                    required
                  />
                </div>
              </div>

              {/* Prices and Discount */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preço Atual (R$) *
                  </label>
                  <input
                    type="text"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    placeholder="29.90"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preço Anterior (R$)
                  </label>
                  <input
                    type="text"
                    value={formData.previousPrice}
                    onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value })}
                    placeholder="59.90"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    % Desconto
                  </label>
                  <input
                    type="text"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
              </div>

              {/* Rating and Sold */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Avaliação (ex: 4.8)
                  </label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="4.9"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantidade Vendida
                  </label>
                  <input
                    type="text"
                    value={formData.soldCount}
                    onChange={(e) => setFormData({ ...formData, soldCount: e.target.value })}
                    placeholder="12500"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Imagem Principal (URL ou caminho interno) *
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/src/assets/images/... ou URL pública"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                  required
                />
              </div>

              {/* Short description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pequena Descrição (para o card de produto)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Resumo chamativo em 1 ou 2 linhas..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>

              {/* Full description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes completos sobre o produto..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>

              {/* Benefits (1 per line) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Principais Benefícios (1 por linha)
                </label>
                <textarea
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="Economiza tempo na cozinha&#10;Fácil de limpar&#10;Livre de BPA"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Para quem esse produto é indicado
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Ex: Pessoas práticas, estudantes, donas de casa..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Palavras-chave para busca (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="furadeira, bateria, ferramenta, impacto"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#EE4D2D]"
                  />
                  <span>Destaque</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="accent-[#EE4D2D]"
                  />
                  <span>Mais Vendido</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isViral}
                    onChange={(e) => setFormData({ ...formData, isViral: e.target.checked })}
                    className="accent-[#EE4D2D]"
                  />
                  <span>Viral TikTok</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-[#EE4D2D]"
                  />
                  <span>Ativo no Site</span>
                </label>
              </div>

              {/* Submit / Cancel buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
