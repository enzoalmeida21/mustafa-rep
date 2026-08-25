import Fastify from "fastify";
import cors from "@fastify/cors";
import { assertRuntimeEnv, env } from "./lib/env.js";
import { categoryRoutes } from "./routes/categories.js";
import { healthRoutes } from "./routes/health.js";
import { industryRoutes } from "./routes/industries.js";
import { orderRoutes } from "./routes/orders.js";
import { productRoutes } from "./routes/products.js";

async function main() {
  assertRuntimeEnv();

  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: env.corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
  });

  await app.register(healthRoutes);
  await app.register(industryRoutes);
  await app.register(categoryRoutes);
  await app.register(productRoutes);
  await app.register(orderRoutes);

  await app.listen({ port: env.port, host: "0.0.0.0" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
