import React from 'react';
import { Flame, Sparkles, ShieldCheck, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const HeroBanner: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-[#F8F9FA] border-b border-slate-200/60">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EE4D2D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CURADORIA INDEPENDENTE DE OFERTAS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Os melhores <span className="text-[#EE4D2D]">achadinhos da Shopee</span> em um só lugar
            </h1>

            {/* Subtitles */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Produtos que estão bombando na internet e ofertas selecionadas a dedo. Encontre novidades virais com descontos imperdíveis e compre com total segurança no site oficial da Shopee.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <button
                onClick={() => navigate('/virais')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Virais do TikTok</span>
              </button>

              <button
                onClick={() => navigate('/produtos-ate-50')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>🎁 Achadinhos até R$ 50</span>
              </button>

              <button
                onClick={() => navigate('/mais-vendidos')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Flame className="w-3.5 h-3.5 text-[#EE4D2D]" />
                <span>Mais Vendidos</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#EE4D2D]" />
                <span>Links diretos oficiais Shopee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Ofertas atualizadas diariamente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Avaliações reais de compradores</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-16/10 lg:aspect-4/3 group">
              <img
                src="/src/assets/images/hero_achadinhos_banner_1790118286383.jpg"
                alt="Achadinhos da Shopee Brasil em destaque"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Tendência da Semana
                </span>
                <p className="font-display text-lg sm:text-xl font-extrabold leading-snug">
                  Produtos práticos para casa, tecnologia e dia a dia com até 60% OFF
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-200">Garimpados por especialistas</span>
                  <button
                    onClick={() => navigate('/ofertas')}
                    className="px-3 py-1.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Conferir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
