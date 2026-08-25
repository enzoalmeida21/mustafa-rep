import { NextResponse } from "next/server";
import { serializeProduct } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
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
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...industry,
      products: industry.products.map(serializeProduct),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao carregar indústria" },
      { status: 500 },
    );
  }
}
