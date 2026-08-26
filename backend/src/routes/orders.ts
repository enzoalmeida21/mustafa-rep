import type { FastifyPluginAsync } from "fastify";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { sendOrderEmails } from "../lib/email.js";
import { env } from "../lib/env.js";
import { serializeOrder, toMoney } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../plugins/auth.js";

const orderBody = z.object({
  customerName: z.string().min(2),
  company: z.string().optional().nullable(),
  city: z.string().min(2),
  state: z.string().length(2),
  phone: z.string().min(8),
  email: z.string().email(),
  notes: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

const statusBody = z.object({
  status: z.enum(["novo", "em_analise", "confirmado", "enviado", "cancelado"]),
});

function saleUnit(unit: string) {
  const normalized = unit.trim().toLowerCase();
  if (!normalized || /^(unid\.?|un\.?|und\.?|unidade|unidades)$/.test(normalized)) {
    return "cx";
  }
  return unit.trim();
}

function generateOrderNumber() {
  const now = new Date();
  const stamp = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `MF-${stamp}-${rand}`;
}

export const orderRoutes: FastifyPluginAsync = async (app) => {
  app.post("/orders", async (request, reply) => {
    const parsed = orderBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== new Set(productIds).size) {
      return reply.code(400).send({ error: "One or more products are unavailable" });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const lineItems = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = new Decimal(product.price);
      const lineTotal = unitPrice.mul(item.quantity);
      return {
        productId: product.id,
        productName: product.name,
        unit: saleUnit(product.unit),
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const total = lineItems.reduce(
      (acc, item) => acc.add(item.lineTotal),
      new Decimal(0)
    );

    const order = await prisma.order.create({
      data: {
        number: generateOrderNumber(),
        customerName: data.customerName,
        company: data.company ?? null,
        city: data.city,
        state: data.state.toUpperCase(),
        phone: data.phone,
        email: data.email,
        notes: data.notes ?? null,
        total,
        items: {
          create: lineItems,
        },
      },
      include: { items: true },
    });

    const emailPayload = {
      number: order.number,
      customerName: order.customerName,
      company: order.company,
      city: order.city,
      state: order.state,
      phone: order.phone,
      email: order.email,
      notes: order.notes,
      total: toMoney(order.total),
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: toMoney(item.unitPrice),
        lineTotal: toMoney(item.lineTotal),
      })),
    };

    void sendOrderEmails(emailPayload);

    return reply.code(201).send({
      ...serializeOrder(order),
      whatsappUrl: env.whatsappNumber
        ? `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(
            `Olá! Acabei de enviar o pedido ${order.number} pelo site mustafarep.com.`
          )}`
        : null,
    });
  });

  app.get("/admin/orders", { preHandler: requireAdmin }, async (request) => {
    const query = request.query as { status?: string };
    const orders = await prisma.order.findMany({
      where: query.status
        ? { status: query.status as never }
        : undefined,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return orders.map(serializeOrder);
  });

  app.get("/admin/orders/:id", { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) {
      return reply.code(404).send({ error: "Order not found" });
    }
    return serializeOrder(order);
  });

  app.patch(
    "/admin/orders/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = statusBody.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.flatten() });
      }

      try {
        const order = await prisma.order.update({
          where: { id },
          data: { status: parsed.data.status },
          include: { items: true },
        });
        return serializeOrder(order);
      } catch {
        return reply.code(404).send({ error: "Order not found" });
      }
    }
  );
};
