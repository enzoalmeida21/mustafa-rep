# Deploy — Mustafá (mustafarep.com)

## 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie:
   - Project URL
   - `anon` key
   - `service_role` key
   - JWT Secret (Settings → API)
   - Connection string Postgres (`DATABASE_URL`)
3. Rode o schema a partir do backend:

```bash
cd backend
export DATABASE_URL="postgresql://..."
npx prisma db push
npm run db:seed
```

4. Auth: habilite Email/Password e crie o usuário admin
5. Storage: crie o bucket público `products`

Políticas sugeridas (SQL no SQL Editor):

```sql
-- Leitura pública das imagens
create policy "Public read products"
on storage.objects for select
using (bucket_id = 'products');

-- Upload apenas autenticado
create policy "Auth upload products"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');
```

## 2. GCP Cloud Run (API)

1. Crie um projeto GCP e habilite Cloud Run + Secret Manager + Artifact Registry
2. Crie secrets: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ORDER_NOTIFY_EMAIL`, `ADMIN_EMAILS`, `WHATSAPP_NUMBER`, `CORS_ORIGIN`
3. Build e deploy:

```bash
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/mustafa-api
gcloud run deploy mustafa-api \
  --image gcr.io/PROJECT_ID/mustafa-api \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-secrets=DATABASE_URL=DATABASE_URL:latest,SUPABASE_URL=SUPABASE_URL:latest,SUPABASE_JWT_SECRET=SUPABASE_JWT_SECRET:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,RESEND_API_KEY=RESEND_API_KEY:latest \
  --set-env-vars=CORS_ORIGIN=https://mustafarep.com,ORDER_NOTIFY_EMAIL=pedidos@mustafarep.com,ADMIN_EMAILS=admin@mustafarep.com,WHATSAPP_NUMBER=5511XXXXXXXX,EMAIL_FROM="Mustafá <onboarding@resend.dev>"
```

4. Mapeie o domínio customizado `api.mustafarep.com` no Cloud Run

## 3. Frontend (Vercel)

1. Importe o repositório na Vercel (root: `frontend`)
2. Env vars:

```
NEXT_PUBLIC_API_URL=https://api.mustafarep.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=5511XXXXXXXX
NEXT_PUBLIC_SITE_URL=https://mustafarep.com
```

3. Domínio: aponte `mustafarep.com` e `www` para a Vercel

## 4. Resend

1. Crie API key
2. Verifique o domínio (quando possível) ou use o remetente de teste
3. Configure `ORDER_NOTIFY_EMAIL` com o e-mail operacional da Mustafá

## 5. Checklist pós-deploy

- [ ] `GET https://api.mustafarep.com/health`
- [ ] Catálogo carrega em `https://mustafarep.com/catalogo`
- [ ] Pedido de teste chega por e-mail
- [ ] Login admin em `/admin/login`
- [ ] Upload de imagem no Storage
