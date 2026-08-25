import { NextResponse } from "next/server";
import { serializeProduct } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: { category: true, industry: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao carregar produto" },
      { status: 500 },
    );
  }
}
