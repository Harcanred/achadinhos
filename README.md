# 🛍️ Achadinhos Online - Portal de Afiliado Shopee Brasil

Portal profissional, moderno, rápido e responsivo para recomendação e divulgação de achadinhos, ofertas e produtos virais da Shopee Brasil, otimizado para conversão de tráfego em cliques qualificados de comissão de afiliado.

---

## 🌟 Principais Recursos

- **Design Mobile-First e Alta Conversão:** Visual clean com destaque nas cores oficiais de compra e botões CTA com alto contraste ("VER OFERTA" e "COMPRAR NA SHOPEE").
- **Catálogo Completo com Filtros Instantâneos:** Busca em tempo real ("furadeira", "air fryer", "fone"), filtros por categoria, faixa de preço (Até R$ 50, Até R$ 100) e ordenação por mais vendidos, menor preço, maior desconto e avaliações.
- **Páginas Individuais de Produtos (`/produto/:slug`):** Galeria de fotos, benefícios em tópicos, especificações técnicas, público-alvo, aviso de afiliado e recomendações relacionadas.
- **Rastreamento de Cliques de Afiliados:** Registro de visualizações, cliques por produto, taxa de conversão (CTR) e histórico no painel administrativo.
- **Painel Administrativo (`/admin`):**
  - Cadastro, edição, duplicação e exclusão de produtos sem necessidade de mexer em código.
  - Controle de tags: Destaque, Mais Vendido, Viral TikTok e Oferta do Dia.
  - Estatísticas dos produtos mais clicados para identificar o que converte melhor.
  - Exportação e importação de backups em JSON.
  - Troca de senha de administrador (Senha padrão: `admin123`).
- **Páginas SEO Automáticas:**
  - `/mais-vendidos`
  - `/ofertas`
  - `/virais`
  - `/produtos-ate-50`
  - `/produtos-ate-100`
  - `/melhores-produtos`
  - `/categoria/:slug` (ex: `/tecnologia`, `/casa`, `/ferramentas`, `/automotivo`, `/moda`, `/beleza`, `/achadinhos`)
- **Blog de Dicas e Curadoria:** Artigos focados em SEO e conversão com produtos da loja incorporados diretamente nos textos.
- **Conformidade Legal & LGPD:**
  - Política de Privacidade, Termos de Uso e Política de Cookies com banner de consentimento.
  - Aviso de Afiliado em destaque no rodapé e páginas de produto: *"Este site participa de programas de afiliados. Podemos receber uma comissão quando você realiza uma compra através de nossos links, sem custo adicional para você."*
- **Sitemap & Robots Dinâmicos:** `/sitemap.xml` e `/robots.txt` para indexação imediata no Google Search Console.
- **Botão Flutuante de WhatsApp:** Acesso para canal VIP de promoções.

---

## 🚀 Como Instalar e Rodar Localmente

### 1. Pré-requisitos
- Node.js versão 18+ instalado
- NPM ou Yarn

### 2. Instalação
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Frontend + API Backend)
npm run dev
```

O site estará disponível em `http://localhost:3000`.

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=3000
NODE_ENV=development

# Opcional: Configuração do Supabase (se desejar usar banco na nuvem)
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica"
```

---

## 🗄️ Como Configurar o Supabase (Opcional)

O sistema vem pronto com armazenamento local persistente e sincronização em arquivo JSON (`data_store.json`), funcionando imediatamente sem nenhuma configuração externa.

Se você preferir usar o Supabase como banco de dados em nuvem:

1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Crie um novo projeto.
3. No painel do Supabase, acesse **SQL Editor**.
4. Copie todo o conteúdo do arquivo `supabase/schema.sql` e clique em **Run**.
5. As tabelas `products`, `categories`, `clicks` e `articles` com políticas de segurança (RLS) serão criadas automaticamente.
6. Copie sua URL e Chave Anon em **Project Settings > API** e cole no seu `.env`.

---

## 🛒 Como Cadastrar Produtos e Inserir Links de Afiliado

1. Acesse `http://localhost:3000/admin` (ou seu domínio `/admin`).
2. Digite a senha de acesso (padrão inicial: `admin123`).
3. Clique no botão **"Novo Produto"**.
4. Preencha os dados:
   - **Nome do produto:** Ex: *Mini Processador Elétrico Triturador USB*
   - **Categoria:** Selecione a categoria adequada.
   - **Preço Atual e Anterior:** Ex: Preço anterior `R$ 59,90` e preço atual `R$ 28,90`.
   - **Link de Afiliado Shopee:** Cole seu link oficial gerado no Programa de Afiliados da Shopee (ex: `https://shope.ee/XYZ123` ou link com sua tag `universal_link`).
   - **Imagem Principal:** Cole a URL da imagem ou caminho de asset.
   - **Benefícios e Público:** Digite os diferenciais que convencem o visitante a comprar.
   - **Selo Viral / Mais Vendido:** Marque a opção para o produto aparecer nas seções especiais da página inicial e do menu.
5. Clique em **"Cadastrar Produto"**.
6. O produto é publicado instantaneamente no site com URL amigável e SEO otimizado!

---

## ☁️ Como Publicar o Site na Vercel

O projeto foi estruturado com compatibilidade nativa para deploy na **Vercel**:

1. Suba o código para seu repositório no GitHub ou GitLab.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Selecione o repositório do projeto.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Clique em **"Deploy"**.

### Conectando Domínio Próprio na Vercel:
1. No painel do projeto na Vercel, acesse **Settings > Domains**.
2. Digite seu domínio (ex: `achadinhosonline.com.br` ou `seusite.com.br`).
3. Siga as instruções de DNS da Vercel adicionando o registro **CNAME** ou apontamento **Tipo A** no seu registrador (ex: Registro.br, Cloudflare ou GoDaddy).
4. O certificado SSL gratuito (HTTPS) será ativado automaticamente em poucos minutos.

---

## 📈 Rastreamento e Analytics (Google e Meta)

O site possui despachador de eventos integrado:
- `product_view`: Quando alguém entra na página do produto.
- `affiliate_click`: Quando o visitante clica no botão "COMPRAR NA SHOPEE" ou "VER OFERTA".
- `share_product`: Quando alguém compartilha no WhatsApp, Telegram, etc.

Para conectar o Google Analytics 4 ou Meta Pixel, basta adicionar seus IDs no `index.html` ou gerenciar via Google Tag Manager.

---

## ⚖️ Conformidade Legal e LGPD

- O portal inclui todas as páginas de transparência requeridas pelo Programa de Afiliados da Shopee e pela legislação brasileira.
- Todo o tráfego é direcionado de forma limpa e transparente sem redirecionamentos fraudulentos.
