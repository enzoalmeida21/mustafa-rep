import type { FastifyPluginAsync } from "fastify";
import { missingRuntimeEnv } from "../lib/env.js";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => {
    const missing = missingRuntimeEnv();
    return {
      ok: true,
      service: "mustafa-api",
      timestamp: new Date().toISOString(),
      ready: missing.length === 0,
      missingEnv: missing,
    };
  });
};
