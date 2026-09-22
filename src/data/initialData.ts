import { Category, Product, Article } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'tecnologia', name: 'Tecnologia', slug: 'tecnologia', icon: 'Smartphone', description: 'Eletrônicos inteligentes, fones, smartwatches e acessórios' },
  { id: 'casa', name: 'Casa & Cozinha', slug: 'casa', icon: 'Home', description: 'Utensílios práticos, organizadores e achadinhos para seu lar' },
  { id: 'ferramentas', name: 'Ferramentas', slug: 'ferramentas', icon: 'Wrench', description: 'Kits práticos, parafusadeiras e utilidades de bancada' },
  { id: 'automotivo', name: 'Automotivo', slug: 'automotivo', icon: 'Car', description: 'Acessórios, suportes e cuidados essenciais para seu veículo' },
  { id: 'moda', name: 'Moda', slug: 'moda', icon: 'Shirt', description: 'Roupas, mochilas antifurto e acessórios com ótimo custo-benefício' },
  { id: 'beleza', name: 'Beleza', slug: 'beleza', icon: 'Sparkles', description: 'Cuidados com a pele, escovas multifuncionais e maquiagem' },
  { id: 'achadinhos', name: 'Achadinhos Virais', slug: 'achadinhos', icon: 'Zap', description: 'Produtos curiosos e úteis que viralizaram nas redes sociais' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Forma de Silicone para Air Fryer Reutilizável com Alça Antiaderente',
    slug: 'forma-de-silicone-para-air-fryer-reutilizavel',
    category: 'casa',
    categoryName: 'Casa & Cozinha',
    shortDescription: 'Protege a cesta da sua Air Fryer contra gordura e restos de comida. Lavável na lava-louças e livre de BPA.',
    description: 'A Forma de Silicone para Air Fryer é o acessório indispensável para quem ama praticidade. Feita em silicone de grau alimentício resistente a até 230°C, ela substitui o papel manteiga descartável e preserva a vida útil do cesto antiaderente da fritadeira.',
    benefits: [
      'Economiza tempo: nada de esfregar gordura queimada na grelha',
      'Silicone 100% de grau alimentício atóxico e livre de BPA',
      'Suporta de -40°C até 240°C no forno ou fritadeira elétrica',
      'Alças laterais seguras para retirar sem queimar as mãos',
      'Compatível com fritadeiras de 3L a 5.5L'
    ],
    specs: [
      { label: 'Material', value: 'Silicone Alimentício Premium' },
      { label: 'Dimensões', value: '20 cm diâmetro x 6.5 cm altura' },
      { label: 'Resistência Térmica', value: '-40°C a 240°C' },
      { label: 'Compatibilidade', value: 'Air Fryers redondas e quadradas (3.2L a 5L)' }
    ],
    targetAudience: 'Quem usa a Air Fryer no dia a dia e quer cozinhar de forma limpa, saudável e sem perder tempo na pia.',
    image: '/src/assets/images/product_airfryer_gadget_1790118295896.jpg',
    gallery: [
      '/src/assets/images/product_airfryer_gadget_1790118295896.jpg',
      '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg'
    ],
    currentPrice: 22.90,
    previousPrice: 45.00,
    discountPercent: 49,
    rating: 4.9,
    reviewCount: 4810,
    soldCount: 18500,
    affiliateUrl: 'https://shopee.com.br/search?keyword=forma+silicone+airfryer',
    keywords: ['air fryer', 'silicone', 'cozinha', 'achadinho', 'casa'],
    isFeatured: true,
    isBestSeller: true,
    isViral: true,
    isDailyDeal: true,
    isActive: true,
    createdAt: '2026-03-01T10:00:00Z',
    views: 1420,
    clicks: 412
  },
  {
    id: 'prod-2',
    name: 'Kit Parafusadeira e Furadeira de Impacto Sem Fio 12V com 2 Baterias e Maleta',
    slug: 'kit-parafusadeira-furadeira-impacto-12v-maleta',
    category: 'ferramentas',
    categoryName: 'Ferramentas',
    shortDescription: 'Potente, com torque ajustável em 25 níveis, função martelete para parede e maleta completa com brocas.',
    description: 'Kit de alta performance ideal para reparos domésticos, montagem de móveis e marcenaria. Acompanha 2 baterias recarregáveis de lítio para você nunca parar no meio de um trabalho.',
    benefits: [
      '2 Baterias de Íons de Lítio: autonomia contínua sem depender de tomadas',
      'Mandril de aperto rápido de 10mm sem necessidade de chave',
      'Luz LED embutida para trabalhar em cantos escuros',
      'Duas velocidades com reversão de giro rápida',
      'Acompanha maleta rígida e kit com mais de 20 acessórios e pontas'
    ],
    specs: [
      { label: 'Tensão', value: '12V Bivolt Automático' },
      { label: 'Torque Máximo', value: '28 N.m (25 posições reguláveis)' },
      { label: 'Velocidade', value: '0-350 / 0-1350 RPM' },
      { label: 'Peso', value: '1.2 kg com bateria' }
    ],
    targetAudience: 'Entusiastas do Faça Você Mesmo (DIY), montadores, donos de casa e técnicos que buscam versatilidade com baixo investimento.',
    image: '/src/assets/images/product_furadeira_kit_1790118310008.jpg',
    gallery: [
      '/src/assets/images/product_furadeira_kit_1790118310008.jpg'
    ],
    currentPrice: 139.90,
    previousPrice: 249.00,
    discountPercent: 44,
    rating: 4.8,
    reviewCount: 3120,
    soldCount: 9450,
    affiliateUrl: 'https://shopee.com.br/search?keyword=kit+furadeira+parafusadeira+12v',
    keywords: ['furadeira', 'parafusadeira', 'ferramentas', 'bateria', 'marcenaria'],
    isFeatured: true,
    isBestSeller: true,
    isViral: false,
    isDailyDeal: true,
    isActive: true,
    createdAt: '2026-03-05T12:00:00Z',
    views: 980,
    clicks: 290
  },
  {
    id: 'prod-3',
    name: 'Fone de Ouvido Bluetooth 5.3 TWS com Cancelamento de Ruído e Display Digital',
    slug: 'fone-de-ouvido-bluetooth-tws-cancelamento-ruido',
    category: 'tecnologia',
    categoryName: 'Tecnologia',
    shortDescription: 'Graves potentes, case com visor digital de bateria em tempo real, até 24h de reprodução e microfone HD.',
    description: 'Experimente liberdade sonora total com conexão instantânea Bluetooth 5.3 com baixíssima latência. Ideal para músicas, reuniões, chamadas e jogos no smartphone.',
    benefits: [
      'Estojo de carregamento com tela LED com porcentagem exata de bateria',
      'Pareamento automático ao retirar da caixa',
      'Controle por toque sensível para pausar, pular e atender chamadas',
      'Proteção contra respingos de água e suor (IPX5)',
      'Bateria duradoura: 5h nos fones + 20h com a case'
    ],
    specs: [
      { label: 'Conectividade', value: 'Bluetooth 5.3 com alcance até 10m' },
      { label: 'Autonomia', value: 'Até 24h totais com estojo' },
      { label: 'Entrada', value: 'USB Tipo C' },
      { label: 'Compatibilidade', value: 'Android, iPhone, PC e Notebooks' }
    ],
    targetAudience: 'Estudantes, esportistas e profissionais que precisam de áudio nítido e bom microfone gastando pouco.',
    image: '/src/assets/images/product_fone_bluetooth_1790118319129.jpg',
    gallery: [
      '/src/assets/images/product_fone_bluetooth_1790118319129.jpg'
    ],
    currentPrice: 42.50,
    previousPrice: 89.90,
    discountPercent: 53,
    rating: 4.9,
    reviewCount: 7850,
    soldCount: 29300,
    affiliateUrl: 'https://shopee.com.br/search?keyword=fone+bluetooth+5.3+tws',
    keywords: ['fone', 'bluetooth', 'tecnologia', 'som', 'tws', 'viral'],
    isFeatured: true,
    isBestSeller: true,
    isViral: true,
    isDailyDeal: true,
    isActive: true,
    createdAt: '2026-03-08T15:00:00Z',
    views: 2840,
    clicks: 860
  },
  {
    id: 'prod-4',
    name: 'Mini Processador Elétrico Triturador de Alimentos USB Portátil 250ml',
    slug: 'mini-processador-eletrico-triturador-usb-250ml',
    category: 'casa',
    categoryName: 'Casa & Cozinha',
    shortDescription: 'Tritura alho, cebola, temperos e carnes em 10 segundos com apenas um clique. Sem cheiro nas mãos!',
    description: 'O utensílio mais viral do TikTok que simplificou o preparo de comida no Brasil. Compacto, sem fio e recarregável por cabo USB.',
    benefits: [
      'Lâminas triplas em aço inoxidável de alta resistência',
      'Acionamento simples com botão superior',
      'Fácil de desmontar e enxaguar em água corrente',
      'Bateria dura dezenas de utilizações com uma única carga'
    ],
    specs: [
      { label: 'Capacidade', value: '250 ml' },
      { label: 'Alimentação', value: 'Recarregável via USB (Cabo incluso)' },
      { label: 'Material', value: 'Plástico ABS Alimentício + Lâminas de Aço Inox' }
    ],
    targetAudience: 'Quem quer praticidade na cozinha sem ter que picar temperos na faca e ficar com cheiro de alho nos dedos.',
    image: '/src/assets/images/product_airfryer_gadget_1790118295896.jpg',
    gallery: [
      '/src/assets/images/product_airfryer_gadget_1790118295896.jpg'
    ],
    currentPrice: 28.90,
    previousPrice: 59.90,
    discountPercent: 52,
    rating: 4.8,
    reviewCount: 3950,
    soldCount: 14200,
    affiliateUrl: 'https://shopee.com.br/search?keyword=mini+processador+alimentos+usb',
    keywords: ['processador', 'alho', 'cozinha', 'achadinho', 'usb'],
    isFeatured: false,
    isBestSeller: true,
    isViral: true,
    isDailyDeal: false,
    isActive: true,
    createdAt: '2026-03-10T14:00:00Z',
    views: 1250,
    clicks: 380
  },
  {
    id: 'prod-5',
    name: 'Aspirador de Pó Portátil Sem Fio para Carro e Casa Alta Sucção',
    slug: 'aspirador-de-po-portatil-sem-fio-veicular',
    category: 'automotivo',
    categoryName: 'Automotivo',
    shortDescription: 'Bateria recarregável, sucção ciclônica forte e bicos para frestas de bancos e teclados de computador.',
    description: 'Mantenha os bancos do seu carro e cantinhos da casa impecáveis com este aspirador compacto de 120W com filtro HEPA lavável.',
    benefits: [
      'Potente sucção para migalhas, areia e pelos de animais',
      'Sem fios embaraçados: use em qualquer lugar do carro',
      'Filtro HEPA lavável que retém até partículas finas de poeira',
      'Acessórios inclusos: bico fino alongado e escova para tapetes'
    ],
    specs: [
      { label: 'Potência', value: '120W (6000Pa)' },
      { label: 'Bateria', value: '2000mAh Recarregável USB' },
      { label: 'Capacidade de Pó', value: '0.5 Litro' }
    ],
    targetAudience: 'Motoristas de aplicativo, donos de pets e quem gosta de manter o veículo sempre cheiroso e limpo.',
    image: '/src/assets/images/product_furadeira_kit_1790118310008.jpg',
    gallery: [
      '/src/assets/images/product_furadeira_kit_1790118310008.jpg'
    ],
    currentPrice: 54.90,
    previousPrice: 99.00,
    discountPercent: 45,
    rating: 4.7,
    reviewCount: 2200,
    soldCount: 8100,
    affiliateUrl: 'https://shopee.com.br/search?keyword=aspirador+portatil+carro+sem+fio',
    keywords: ['aspirador', 'carro', 'automotivo', 'limpeza', 'sem fio'],
    isFeatured: true,
    isBestSeller: false,
    isViral: true,
    isDailyDeal: true,
    isActive: true,
    createdAt: '2026-03-12T09:00:00Z',
    views: 890,
    clicks: 240
  },
  {
    id: 'prod-6',
    name: 'Mochila Antifurto Impermeável com Porta USB e Compartimento para Notebook',
    slug: 'mochila-antifurto-impermeavel-notebook-usb',
    category: 'moda',
    categoryName: 'Moda',
    shortDescription: 'Zíperes ocultos traseiros, tecido Oxford resistente à chuva, bolsos secretos e passagem externa para carregador de celular.',
    description: 'A queridinha de universitários e trabalhadores que andam de transporte público. Design ergonômico que distribui o peso e protege equipamentos valiosos.',
    benefits: [
      'Abertura 180° com zíper voltado para as costas (impossível abrir por trás)',
      'Tecido impermeável repelente à água contra chuva repentina',
      'Alça acolchoada respirável que não machuca os ombros',
      'Compartimento para notebook de até 15.6 polegadas'
    ],
    specs: [
      { label: 'Material', value: 'Oxford 900D Impermeável' },
      { label: 'Capacidade', value: '35 Litros' },
      { label: 'Compatibilidade', value: 'Laptops até 15.6"' }
    ],
    targetAudience: 'Trabalhadores, viajantes urbanos e universitários que precisam de segurança e conforto diário.',
    image: '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
    gallery: [
      '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg'
    ],
    currentPrice: 68.90,
    previousPrice: 120.00,
    discountPercent: 43,
    rating: 4.8,
    reviewCount: 3410,
    soldCount: 11200,
    affiliateUrl: 'https://shopee.com.br/search?keyword=mochila+antifurto+notebook+impermeavel',
    keywords: ['mochila', 'antifurto', 'notebook', 'viagem', 'moda'],
    isFeatured: true,
    isBestSeller: true,
    isViral: false,
    isDailyDeal: false,
    isActive: true,
    createdAt: '2026-03-14T11:00:00Z',
    views: 1100,
    clicks: 310
  },
  {
    id: 'prod-7',
    name: 'Escova Secadora, Alisadora e Modeladora 5 em 1 Multifuncional',
    slug: 'escova-secadora-alisadora-modeladora-5-em-1',
    category: 'beleza',
    categoryName: 'Beleza',
    shortDescription: 'Seca, alisa, modela e dá volume com pontas intercambiáveis e íons que reduzem o frizz sem queimar os fios.',
    description: 'Resultados de salão profissional no conforto da sua casa em minutos. Inclui bico secador, escova redonda para cachos e escova raquete para alinhamento.',
    benefits: [
      '5 acessórios fáceis de trocar com um simples clique',
      'Tecnologia de íons negativos que selam as cutículas e dão brilho',
      '3 níveis de temperatura e velocidade do ar',
      'Cabo giratório 360 graus para total mobilidade'
    ],
    specs: [
      { label: 'Potência', value: '1000W' },
      { label: 'Voltagem', value: '110V ou 220V' },
      { label: 'Revestimento', value: 'Cerâmica com Íons' }
    ],
    targetAudience: 'Quem quer economizar tempo e dinheiro na finalização do cabelo com visual de salão em qualquer dia.',
    image: '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
    gallery: [
      '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg'
    ],
    currentPrice: 89.90,
    previousPrice: 179.00,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 5120,
    soldCount: 16800,
    affiliateUrl: 'https://shopee.com.br/search?keyword=escova+secadora+5+em+1',
    keywords: ['escova secadora', 'cabelo', 'beleza', 'alisadora', 'frizz'],
    isFeatured: false,
    isBestSeller: true,
    isViral: true,
    isDailyDeal: true,
    isActive: true,
    createdAt: '2026-03-15T16:00:00Z',
    views: 1980,
    clicks: 580
  },
  {
    id: 'prod-8',
    name: 'Luminária LED com Sensor de Presença Magnética Recarregável USB',
    slug: 'luminaria-led-sensor-presenca-magnetica-recarregavel',
    category: 'achadinhos',
    categoryName: 'Achadinhos Virais',
    shortDescription: 'Acende automaticamente ao passar no escuro. Fixação magnética sem furos no guarda-roupa, escadas e corredores.',
    description: 'Chega de tropeçar no escuro à noite ou ligar a luz forte do teto. Sensor inteligente com alcance de até 3 metros e desligamento automático após 20 segundos.',
    benefits: [
      'Instalação em 5 segundos: fita 3M e base magnética inclusa',
      'Bateria recarregável via USB: economize em pilhas',
      'Luz quente suave ou branca neutra que não cansa os olhos',
      'Sensor duplo: fotoelétrico (só aciona no escuro) e infravermelho de movimento'
    ],
    specs: [
      { label: 'Comprimento', value: '20 cm / 30 cm' },
      { label: 'Autonomia', value: 'Até 45 dias em modo automático' },
      { label: 'Ângulo do Sensor', value: '120 graus até 3 metros' }
    ],
    targetAudience: 'Perfeito para armários, gavetas, corredor de crianças, escadas e cabeceiras de cama.',
    image: '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
    gallery: [
      '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg'
    ],
    currentPrice: 19.90,
    previousPrice: 39.90,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 6400,
    soldCount: 22100,
    affiliateUrl: 'https://shopee.com.br/search?keyword=luminaria+led+sensor+presenca+magnetica',
    keywords: ['luminaria', 'led', 'sensor', 'achadinho', 'casa', 'viral'],
    isFeatured: true,
    isBestSeller: true,
    isViral: true,
    isDailyDeal: true,
    isActive: true,
    createdAt: '2026-03-16T18:00:00Z',
    views: 2450,
    clicks: 720
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: '10 produtos da Shopee que valem muito a pena comprar em 2026',
    slug: '10-produtos-da-shopee-que-valem-a-pena-comprar',
    excerpt: 'Testamos e selecionamos os achadinhos com melhor custo-benefício, avaliações acima de 4.8 estrelas e entrega rápida.',
    content: `A Shopee se consolidou como o marketplace favorito dos brasileiros para economizar em itens do cotidiano. No entanto, com milhões de anúncios disponíveis, encontrar produtos que realmente entregam o que prometem exige garimpo.\n\nNossa equipe testou e levantou os 10 itens que mais surpreendem pela qualidade versus preço:\n\n1. **Formas de silicone para Air Fryer**: Economizam horas na limpeza e custam menos de R$ 25.\n2. **Mini processador elétrico USB**: Pica alho e cebola em 10 segundos sem sujar as mãos.\n3. **Fones Bluetooth 5.3 com visor de bateria**: Custo inferior a R$ 50 com som equivalente a modelos de R$ 200.\n4. **Luminárias magnéticas com sensor**: Perfeitas para closets e corredores noturnos.\n5. **Kits de ferramentas compactos**: Essenciais para montagem de móveis e pequenos reparos.\n\nConfira os produtos selecionados abaixo e garanta o desconto oficial do vendedor com cupom de frete grátis!`,
    coverImage: '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
    publishedAt: '2026-03-15',
    readTime: '4 min de leitura',
    featuredProductIds: ['prod-1', 'prod-3', 'prod-4', 'prod-8'],
    author: 'Equipe Achadinhos Online'
  },
  {
    id: 'art-2',
    title: '7 achadinhos da Shopee por menos de R$ 50 que facilitam o seu dia a dia',
    slug: '7-achadinhos-da-shopee-por-menos-de-50-reais',
    excerpt: 'Ideias inteligentes e baratas para organizar a casa, economizar tempo e resolver pequenas chatices da rotina.',
    content: `Você não precisa gastar muito para deixar sua rotina mais prática e sua casa mais organizada. Reunimos 7 achadinhos com valores abaixo de cinquenta reais que fazem toda a diferença:\n\n- **Protetor de silicone para Air Fryer**: Evita acúmulo de gordura no cesto.\n- **Luz LED com sensor de movimento**: Dispensa instalação elétrica.\n- **Fone de Ouvido TWS**: Conectividade sem fio e som envolvente.\n- **Triturador de alho recarregável**: Cozinhar nunca foi tão rápido.\n\nTodos os itens foram selecionados com foco em alta pontuação e milhares de avaliações reais na Shopee Brasil.`,
    coverImage: '/src/assets/images/product_airfryer_gadget_1790118295896.jpg',
    publishedAt: '2026-03-18',
    readTime: '3 min de leitura',
    featuredProductIds: ['prod-1', 'prod-3', 'prod-4', 'prod-8'],
    author: 'Camila Santos'
  },
  {
    id: 'art-3',
    title: 'Produtos da Shopee que viralizaram no TikTok e realmente funcionam',
    slug: 'produtos-da-shopee-que-viralizaram-no-tiktok',
    excerpt: 'Separamos o que é marketing exagerado do que realmente entrega utilidade e vale cada centavo do seu dinheiro.',
    content: `Quem navega pelo TikTok ou Instagram Reels certamente já se deparou com vídeos de produtos mágicos da Shopee. Mas será que eles funcionam de verdade na vida real?\n\nColocamos à prova alguns dos maiores sucessos virais da internet:\n\n- **O mini processador elétrico**: Surpreendeu pela força do motor e facilidade de lavar.\n- **A luminária com ímã**: Ilumina armários sem precisar de furadeira.\n- **O aspirador portátil para carros**: Excelente para limpar cantinhos do banco e teclado do computador.\n\nVeja as análises detalhadas e os links seguros direto na loja oficial do vendedor.`,
    coverImage: '/src/assets/images/hero_achadinhos_banner_1790118286383.jpg',
    publishedAt: '2026-03-20',
    readTime: '5 min de leitura',
    featuredProductIds: ['prod-1', 'prod-4', 'prod-5', 'prod-8'],
    author: 'Lucas Ribeiro'
  }
];
