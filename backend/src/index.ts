import Fastify from "fastify";
import cors from "@fastify/cors";
import { env, missingRuntimeEnv, warnRuntimeEnv } from "./lib/env.js";
import { categoryRoutes } from "./routes/categories.js";
import { healthRoutes } from "./routes/health.js";
import { industryRoutes } from "./routes/industries.js";
import { orderRoutes } from "./routes/orders.js";
import { productRoutes } from "./routes/products.js";

async function main() {
  warnRuntimeEnv();

  const app = Fastify({
    logger: true,
  });

  const origins = env.corsOrigin
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  await app.register(cors, {
    origin: origins.includes("*") ? true : origins,
    credentials: true,
  });

  await app.register(healthRoutes);
  await app.register(industryRoutes);
  await app.register(categoryRoutes);
  await app.register(productRoutes);
  await app.register(orderRoutes);

  const port = Number(process.env.PORT ?? env.port ?? 8080);
  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(
    {
      port,
      missingEnv: missingRuntimeEnv(),
    },
    "mustafa-api listening"
  );
}

main().catch((error) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});
