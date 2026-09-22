import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWhatsApp = () => {
    const phone = '5511999999999'; // Can be customized in admin
    const text = encodeURIComponent(
      'Olá! Gostaria de receber os melhores achadinhos, ofertas e cupons com desconto da Shopee!'
    );
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Tooltip notice */}
      {showTooltip && (
        <div className="relative mb-2 max-w-xs bg-white p-3 rounded-2xl shadow-xl border border-slate-200/80 text-xs text-slate-700 animate-fade-in flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-slate-900 leading-tight">Grupo VIP de Achadinhos</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Receba cupons de frete grátis e ofertas relâmpago no seu WhatsApp!
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-600 hover:text-slate-600 p-0.5"
            title="Fechar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleOpenWhatsApp}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group focus:outline-none cursor-pointer"
        aria-label="Abrir WhatsApp para ofertas da Shopee"
        title="Receber ofertas no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </button>
    </div>
  );
};
