import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: process.env.DATABASE_URL ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  orderNotifyEmail: process.env.ORDER_NOTIFY_EMAIL ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "Mustafá <onboarding@resend.dev>",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "",
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
};

export function assertRuntimeEnv() {
  required("DATABASE_URL");
  required("SUPABASE_URL");
  required("SUPABASE_JWT_SECRET");
}
