import type { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify, type JWTPayload } from "jose";
import { env } from "../lib/env.js";

export type AuthUser = {
  id: string;
  email: string;
};

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

async function verifySupabaseJwt(token: string): Promise<AuthUser> {
  if (!env.supabaseJwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET is not configured");
  }

  const secret = new TextEncoder().encode(env.supabaseJwtSecret);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return extractUser(payload);
}

function extractUser(payload: JWTPayload): AuthUser {
  const email = String(payload.email ?? "").toLowerCase();
  const id = String(payload.sub ?? "");
  if (!id || !email) {
    throw new Error("Invalid token payload");
  }
  return { id, email };
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  try {
    const token = header.slice("Bearer ".length);
    const user = await verifySupabaseJwt(token);

    if (env.adminEmails.length > 0 && !env.adminEmails.includes(user.email)) {
      return reply.code(403).send({ error: "Forbidden" });
    }

    request.user = user;
  } catch {
    return reply.code(401).send({ error: "Invalid token" });
  }
}
