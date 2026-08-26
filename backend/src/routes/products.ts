import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { serializeProduct } from "../lib/money.js";
import { requireAdmin } from "../plugins/auth.js";

const productBody = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  brand: z.string().optional().nullable(),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  unit: z.string().min(1).default("cx"),
  packLabel: z.string().optional().nullable(),
  ean: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  imageUrl: z.string().min(1).optional().nullable(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  industryId: z.string().min(1),
  categoryId: z.string().optional().nullable(),
});

export const productRoutes: FastifyPluginAsync = async (app) => {
  app.get("/products", async (request) => {
    const query = request.query as {
      category?: string;
      industry?: string;
      q?: string;
      featured?: string;
    };

    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(query.industry ? { industry: { slug: query.industry } } : {}),
        ...(query.category ? { category: { slug: query.category } } : {}),
        ...(query.featured === "true" ? { featured: true } : {}),
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q, mode: "insensitive" } },
                { brand: { contains: query.q, mode: "insensitive" } },
                { description: { contains: query.q, mode: "insensitive" } },
                { sku: { contains: query.q, mode: "insensitive" } },
                { ean: { contains: query.q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true, industry: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    return products.map(serializeProduct);
  });

  app.get("/products/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: { category: true, industry: true },
    });
    if (!product) {
      return reply.code(404).send({ error: "Product not found" });
    }
    return serializeProduct(product);
  });

  app.get("/admin/products", { preHandler: requireAdmin }, async () => {
    const products = await prisma.product.findMany({
      include: { category: true, industry: true },
      orderBy: [{ updatedAt: "desc" }],
    });
    return products.map(serializeProduct);
  });

  app.post("/admin/products", { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = productBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        brand: data.brand ?? null,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        unit: data.unit,
        packLabel: data.packLabel ?? null,
        ean: data.ean ?? null,
        sku: data.sku ?? null,
        imageUrl: data.imageUrl ?? null,
        active: data.active ?? true,
        featured: data.featured ?? false,
        industryId: data.industryId,
        categoryId: data.categoryId ?? null,
      },
      include: { category: true, industry: true },
    });
    return reply.code(201).send(serializeProduct(product));
  });

  app.patch(
    "/admin/products/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = productBody.partial().safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      try {
        const product = await prisma.product.update({
          where: { id },
          data: parsed.data,
          include: { category: true, industry: true },
        });
        return serializeProduct(product);
      } catch {
        return reply.code(404).send({ error: "Product not found" });
      }
    }
  );

  app.delete(
    "/admin/products/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await prisma.product.update({
          where: { id },
          data: { active: false },
        });
        return { ok: true };
      } catch {
        return reply.code(404).send({ error: "Product not found" });
      }
    }
  );
};
