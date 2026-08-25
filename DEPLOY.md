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

1. Crie um projeto GCP e habilite Cloud Run + Secret Manager + Artifact Registry / Container Registry
2. Crie secrets: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ORDER_NOTIFY_EMAIL`, `ADMIN_EMAILS`, `WHATSAPP_NUMBER`, `CORS_ORIGIN`
3. **Importante:** há um `Dockerfile` na **raiz** do repo (builda a pasta `backend/`). O trigger padrão do Cloud Build já encontra esse arquivo.

### Trigger no Cloud Build (GitHub)

Opção A — **Dockerfile** (padrão):
- Configuration type: Dockerfile
- Dockerfile location: `/Dockerfile` (raiz)
- Isso resolve o erro `lstat /workspace/Dockerfile: no such file or directory`

Opção B — **cloudbuild.yaml**:
- Configuration type: Cloud Build configuration file
- Location: `/cloudbuild.yaml`

### Build manual

```bash
# Na raiz do repo
gcloud builds submit --config=cloudbuild.yaml

# Ou só a imagem, a partir da pasta backend:
gcloud builds submit ./backend --tag gcr.io/PROJECT_ID/mustafa-api
```

### Variáveis obrigatórias no Cloud Run

Sem estas variáveis o container sobe (`/health`), mas catálogo/pedidos falham:

```
DATABASE_URL
SUPABASE_URL
SUPABASE_JWT_SECRET
```

Recomendadas:

```
SUPABASE_SERVICE_ROLE_KEY
CORS_ORIGIN=https://mustafarep.com,https://www.mustafarep.com
RESEND_API_KEY
ORDER_NOTIFY_EMAIL
ADMIN_EMAILS
WHATSAPP_NUMBER
EMAIL_FROM
```

No Console: Cloud Run → serviço → Edit & deploy → Variables & Secrets.

```bash
gcloud run deploy mustafa-api \
  --image gcr.io/PROJECT_ID/mustafa-api:latest \
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
