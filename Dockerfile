# Dockerfile na raiz do monorepo — Cloud Build / Cloud Run
# Contexto: raiz do repositório

FROM node:22-alpine AS deps
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ .
# DATABASE_URL só é necessária em runtime; generate não precisa de DB real
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate
EXPOSE 8080
CMD ["node", "dist/index.js"]
