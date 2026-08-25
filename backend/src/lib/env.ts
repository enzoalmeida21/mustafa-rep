import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: process.env.DATABASE_URL ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  orderNotifyEmail: process.env.ORDER_NOTIFY_EMAIL ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "Mustafá <onboarding@resend.dev>",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "",
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
};

const REQUIRED = ["DATABASE_URL", "SUPABASE_URL", "SUPABASE_JWT_SECRET"] as const;

export function missingRuntimeEnv(): string[] {
  return REQUIRED.filter((name) => !process.env[name]);
}

/** Loga avisos, mas NÃO derruba o processo — Cloud Run precisa escutar a porta. */
export function warnRuntimeEnv() {
  const missing = missingRuntimeEnv();
  if (missing.length > 0) {
    console.warn(
      `[mustafa-api] Variáveis ausentes (configure no Cloud Run): ${missing.join(", ")}`
    );
  }
}
