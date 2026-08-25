import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    });
    return NextResponse.json(industries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao carregar indústrias" },
      { status: 500 },
    );
  }
}
