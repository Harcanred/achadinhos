import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storage';
import { ShoppingBag, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();
  const categories = StorageService.getCategories();

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-xs mt-16">
      {/* Top Banner Notice */}
      <div className="bg-orange-50/70 border-b border-orange-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EE4D2D]/10 text-[#EE4D2D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Transparência e Isenção de Responsabilidade
              </p>
              <p className="text-slate-600 text-xs mt-0.5 max-w-2xl">
                Este site participa do Programa de Afiliados da Shopee Brasil. As compras são concluídas diretamente no aplicativo ou site oficial do vendedor.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/aviso-afiliado')}
            className="px-4 py-2 bg-white text-slate-800 font-bold rounded-xl border border-slate-200 hover:border-[#EE4D2D] hover:text-[#EE4D2D] transition-colors shrink-0"
          >
            Ler Aviso de Afiliado
          </button>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EE4D2D] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-display font-black text-xl text-slate-900">
                Achadinhos<span className="text-[#EE4D2D]">Online</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs max-w-sm">
              Sua curadoria independente dos melhores produtos, ofertas relâmpago e novidades virais que fazem sucesso na Shopee Brasil. Economize tempo e dinheiro em cada compra!
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block">
                Atualizado diariamente com cupons e melhores preços.
              </span>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
              Categorias
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigate(`/categoria/${c.slug}`)}
                    className="hover:text-[#EE4D2D] transition-colors"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Seleções Especiais */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
              Seleções Especiais
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/mais-vendidos')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  🔥 Mais Vendidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/ofertas')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  ⚡ Ofertas do Dia
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/virais')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  🚀 Virais do TikTok
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/produtos-ate-50')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  🎁 Achadinhos até R$ 50
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/produtos-ate-100')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  💰 Ofertas até R$ 100
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  📝 Blog de Guias
                </button>
              </li>
            </ul>
          </div>

          {/* Legal e Conformidade */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
              Institucional
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/aviso-afiliado')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  Aviso de Afiliado
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacidade')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/termos')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/cookies')}
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  Política de Cookies
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#EE4D2D] transition-colors"
                >
                  Mapa do Site (Sitemap)
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  Painel Administrativo
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Required Disclaimers Text Block */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-3 text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
          <p>
            <strong>Divulgação de Afiliado:</strong> "Este site participa de programas de afiliados. Podemos receber uma comissão quando você realiza uma compra através de nossos links, sem custo adicional para você."
          </p>
          <p>
            <strong>Preços e Disponibilidade:</strong> "Os preços e a disponibilidade dos produtos podem sofrer alterações. Consulte sempre as informações atualizadas na página oficial do vendedor."
          </p>
          <p>
            <strong>Isenção de Marca:</strong> O Achadinhos Online é um portal independente de conteúdo e curadoria e não é o site oficial nem possui vínculo corporativo ou de representação com a Shopee Brasil.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Achadinhos Online. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-[#EE4D2D] fill-[#EE4D2D]" /> para quem ama economizar na internet
          </p>
        </div>
      </div>
    </footer>
  );
};
