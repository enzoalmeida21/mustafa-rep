import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { serializeProduct } from "../lib/money.js";
import { requireAdmin } from "../plugins/auth.js";

const industryBody = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  logoImage: z.string().optional().nullable(),
  accentColor: z.string().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const industryRoutes: FastifyPluginAsync = async (app) => {
  app.get("/industries", async () => {
    const industries = await prisma.industry.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    });
    return industries;
  });

  app.get("/industries/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const industry = await prisma.industry.findFirst({
      where: { slug, active: true },
      include: {
        products: {
          where: { active: true },
          include: { category: true, industry: true },
          orderBy: [{ featured: "desc" }, { name: "asc" }],
        },
      },
    });

    if (!industry) {
      return reply.code(404).send({ error: "Industry not found" });
    }

    return {
      ...industry,
      products: industry.products.map(serializeProduct),
    };
  });

  app.get("/admin/industries", { preHandler: requireAdmin }, async () => {
    return prisma.industry.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
  });

  app.post("/admin/industries", { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = industryBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const industry = await prisma.industry.create({ data: parsed.data });
    return reply.code(201).send(industry);
  });

  app.patch(
    "/admin/industries/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = industryBody.partial().safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }
      try {
        return await prisma.industry.update({
          where: { id },
          data: parsed.data,
        });
      } catch {
        return reply.code(404).send({ error: "Industry not found" });
      }
    }
  );
};
