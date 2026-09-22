import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { useNavigation } from '../context/NavigationContext';
import { ShieldCheck } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { navigate } = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsented = StorageService.getCookieConsent();
    if (!hasConsented) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    StorageService.setCookieConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    StorageService.setCookieConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-center">
      <div className="bg-slate-900/95 text-white max-w-3xl w-full p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-md border border-slate-700/60 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#EE4D2D] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <p className="font-bold text-white mb-0.5">Sua privacidade e cookies (LGPD)</p>
            Utilizamos cookies para métricas anônimas de produtos e melhor experiência. Ao continuar navegando, você concorda com nossa{' '}
            <button
              onClick={() => navigate('/privacidade')}
              className="text-amber-300 hover:underline"
            >
              Política de Privacidade
            </button>{' '}
            e{' '}
            <button
              onClick={() => navigate('/cookies')}
              className="text-amber-300 hover:underline"
            >
              Termos de Cookies
            </button>.
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={handleDecline}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-xs font-bold bg-[#EE4D2D] hover:bg-[#D73211] text-white rounded-xl transition-colors shadow-sm"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
};
