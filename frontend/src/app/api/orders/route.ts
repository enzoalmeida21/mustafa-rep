import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { serializeOrder, toMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OrderBody = {
  customerName: string;
  company?: string | null;
  city: string;
  state: string;
  phone: string;
  email: string;
  notes?: string | null;
  items: Array<{ productId: string; quantity: number }>;
};

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

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as OrderBody;

    if (
      !data?.customerName ||
      !data?.city ||
      !data?.state ||
      !data?.phone ||
      !data?.email ||
      !Array.isArray(data.items) ||
      data.items.length === 0
    ) {
      return NextResponse.json({ error: "Dados do pedido inválidos" }, { status: 400 });
    }

    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== new Set(productIds).size) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 },
      );
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const lineItems = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = new Decimal(product.price);
      const lineTotal = unitPrice.mul(item.quantity);
      return {
        productId: product.id,
        productName: product.name,
        unit: product.unit,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const total = lineItems.reduce(
      (acc, item) => acc.add(item.lineTotal),
      new Decimal(0),
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
        items: { create: lineItems },
      },
      include: { items: true },
    });

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(
          `Olá! Acabei de enviar o pedido ${order.number} pelo site mustafarep.com.`,
        )}`
      : null;

    return NextResponse.json(
      {
        ...serializeOrder(order),
        total: toMoney(order.total),
        whatsappUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Não foi possível enviar o pedido" },
      { status: 500 },
    );
  }
}
