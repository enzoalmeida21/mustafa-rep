# Mustafá — Portal de Pedidos

Portal público em [mustafarep.com](https://mustafarep.com) para catálogo, preços e pedidos sem pagamento online.

## Stack

- **Frontend:** Next.js (Vercel) — `frontend/`
- **Backend:** Fastify em GCP Cloud Run — `backend/`
- **Banco / Auth / Storage:** Supabase (Postgres + Auth + Storage)

## Desenvolvimento local

### 1) Banco (Postgres local opcional)

```bash
docker compose up -d
```

### 2) Backend

```bash
cd backend
cp .env.example .env
# Ajuste DATABASE_URL e demais variáveis
npm install
npx prisma db push
npm run db:seed
npm run dev
```

API: `http://localhost:8080/health`

### 3) Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Site: `http://localhost:3000`

## Fluxo principal

1. Visitante navega no catálogo e adiciona itens
2. Envia pedido no checkout (sem pagamento)
3. API grava no Supabase e notifica por e-mail (Resend)
4. Admin gerencia produtos/pedidos em `/admin` (Supabase Auth)

## Deploy na Vercel (frontend)

1. Importe este repositório na [Vercel](https://vercel.com/new)
2. Em **Root Directory**, selecione `frontend`
3. Framework: Next.js (detectado automaticamente)
4. Variáveis de ambiente:

```
NEXT_PUBLIC_API_URL=https://sua-api.exemplo.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=5511XXXXXXXX
NEXT_PUBLIC_SITE_URL=https://mustafarep.com
```

5. Conecte o domínio `mustafarep.com` nas settings do projeto

> A API (`backend/`) sobe no GCP Cloud Run. Sem a API online, o catálogo/pedidos não carregam.

Detalhes completos: [DEPLOY.md](./DEPLOY.md)
