import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../plugins/auth.js";

const categoryBody = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const categoryRoutes: FastifyPluginAsync = async (app) => {
  app.get("/categories", async () => {
    return prisma.category.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  });

  app.get(
    "/admin/categories",
    { preHandler: requireAdmin },
    async () => {
      return prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { _count: { select: { products: true } } },
      });
    }
  );

  app.post("/admin/categories", { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = categoryBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description ?? null,
        sortOrder: data.sortOrder ?? 0,
        active: data.active ?? true,
      },
    });
    return reply.code(201).send(category);
  });

  app.patch(
    "/admin/categories/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = categoryBody.partial().safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      try {
        const category = await prisma.category.update({
          where: { id },
          data: parsed.data,
        });
        return category;
      } catch {
        return reply.code(404).send({ error: "Category not found" });
      }
    }
  );

  app.delete(
    "/admin/categories/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const products = await prisma.product.count({ where: { categoryId: id } });
      if (products > 0) {
        return reply
          .code(400)
          .send({ error: "Cannot delete category with products. Deactivate instead." });
      }
      await prisma.category.delete({ where: { id } });
      return { ok: true };
    }
  );
};
