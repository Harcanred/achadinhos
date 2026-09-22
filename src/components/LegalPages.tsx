import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { SEOHead } from './SEOHead';
import { ShieldCheck, ArrowLeft, Info, FileText } from 'lucide-react';

interface LegalPagesProps {
  pageType: 'privacidade' | 'termos' | 'cookies' | 'aviso-afiliado';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ pageType }) => {
  const { navigate } = useNavigation();

  const getPageData = () => {
    switch (pageType) {
      case 'aviso-afiliado':
        return {
          title: 'Aviso de Afiliado e Divulgação de Parcerias',
          subtitle: 'Transparência total com nossos visitantes e leitores',
          content: (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-orange-50/70 border border-[#EE4D2D]/30 rounded-2xl">
                <p className="font-bold text-[#EE4D2D] mb-1">Declaração de Afiliação Shopee:</p>
                <p className="text-xs text-slate-800">
                  "Este site participa de programas de afiliados. Podemos receber uma comissão quando você realiza uma compra através de nossos links, sem custo adicional para você."
                </p>
                <p className="text-xs text-slate-800 mt-2">
                  "Os preços e a disponibilidade dos produtos podem sofrer alterações. Consulte sempre as informações atualizadas na página oficial do vendedor."
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Independência Editorial</h3>
                <p>
                  O <strong>Achadinhos Online</strong> é um portal independente dedicado à curadoria, teste e recomendação de produtos populares e ofertas disponíveis na Shopee Brasil. <strong>NÃO somos a loja oficial da Shopee</strong> nem representamos formalmente a marca.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Como Funcionam os Links</h3>
                <p>
                  Ao clicar em botões como "VER OFERTA" ou "COMPRAR NA SHOPEE", você é redirecionado de forma segura para o anúncio oficial do vendedor dentro da plataforma Shopee (site ou aplicativo). Caso venha a finalizar a compra qualificada de acordo com as regras da Shopee, o criador deste portal pode receber uma pequena porcentagem de comissão como forma de remuneração pelo trabalho de curadoria e manutenção do site.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Responsabilidade sobre Vendas, Entregas e Suporte</h3>
                <p>
                  Toda a transação comercial, faturamento, pagamento, expedição, frete, devolução e garantia são de responsabilidade exclusiva da Shopee e de seus respectivos lojistas cadastrados. Este portal não processa pagamentos nem armazena dados de cartão de crédito.
                </p>
              </div>
            </div>
          ),
        };

      case 'privacidade':
        return {
          title: 'Política de Privacidade (LGPD)',
          subtitle: 'Como tratamos seus dados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)',
          content: (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Introdução</h3>
                <p>
                  O <strong>Achadinhos Online</strong> preza pela privacidade, transparência e segurança de todos os seus visitantes. Esta Política de Privacidade explica de forma clara quais dados coletamos e como são utilizados.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Dados que Coletamos</h3>
                <p>
                  Não exigimos cadastro de usuários comuns para navegar no portal ou visualizar produtos. Coletamos apenas dados agregados e anônimos de navegação através de cookies estatísticos (como número de visualizações de página, termos de busca e cliques em botões de afiliados), essenciais para melhorar a experiência do site.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Direitos do Titular (LGPD)</h3>
                <p>
                  Nos termos do art. 18 da LGPD, você tem o direito de solicitar confirmação da existência de tratamento de dados, acesso aos dados, correção de dados incompletos e revogação do consentimento relativo a cookies.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">4. Contato do Encarregado (DPO)</h3>
                <p>
                  Para qualquer dúvida sobre a privacidade de dados ou para exercer seus direitos, entre em contato através dos canais de suporte indicados no rodapé do portal.
                </p>
              </div>
            </div>
          ),
        };

      case 'cookies':
        return {
          title: 'Política de Cookies',
          subtitle: 'Entenda como usamos tecnologias de armazenamento local para melhorar sua navegação',
          content: (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">O que são Cookies?</h3>
                <p>
                  Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita páginas na web. Eles ajudam o site a lembrar de preferências, tais como seus filtros selecionados e produtos visualizados recentemente.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Tipos de Cookies Utilizados</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Cookies Estritamente Necessários:</strong> Garantem o funcionamento técnico do portal e das rotas de navegação.</li>
                  <li><strong>Cookies de Desempenho e Estatística:</strong> Ajudam-nos a entender quais produtos são mais buscados para priorizar achadinhos relevantes.</li>
                  <li><strong>Cookies de Rastreamento de Afiliado:</strong> Gerados quando você clica em um link oficial da Shopee para certificar a atribuição de comissão legítima.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Como Gerenciar Cookies</h3>
                <p>
                  Você pode a qualquer momento ajustar as configurações do seu navegador para recusar ou excluir cookies.
                </p>
              </div>
            </div>
          ),
        };

      case 'termos':
      default:
        return {
          title: 'Termos de Uso',
          subtitle: 'Condições gerais de navegação e utilização do portal Achadinhos Online',
          content: (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Aceitação dos Termos</h3>
                <p>
                  Ao acessar ou utilizar o site <strong>Achadinhos Online</strong>, você concorda em cumprir integralmente as disposições aqui estabelecidas e na legislação brasileira vigente.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Natureza Informativa e de Curadoria</h3>
                <p>
                  Todo o conteúdo exibido neste site possui caráter exclusivamente informativo e recomendatório. Nós nos esforçamos para manter preços, cupons e características técnicas sempre atualizados; todavia, valores e estoques podem variar repentinamente no site do vendedor oficial.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Propriedade Intelectual</h3>
                <p>
                  As marcas "Shopee" e logotipos de terceiros pertencem aos seus respectivos proprietários e são citados unicamente com finalidade identificadora e descritiva para fins de afiliação.
                </p>
              </div>
            </div>
          ),
        };
    }
  };

  const data = getPageData();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <SEOHead title={data.title} description={data.subtitle} />

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar para a página inicial
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#EE4D2D] mb-2 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparência e Conformidade</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {data.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {data.subtitle}
          </p>
        </div>

        {data.content}

        <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
          <span>Última atualização: Março de 2026</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[#EE4D2D] font-semibold hover:underline"
          >
            Voltar ao topo ↑
          </button>
        </div>
      </div>
    </div>
  );
};
