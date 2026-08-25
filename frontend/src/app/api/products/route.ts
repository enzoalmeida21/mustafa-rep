import { NextResponse } from "next/server";
import { serializeProduct } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get("industry") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const q = searchParams.get("q") ?? undefined;
    const featured = searchParams.get("featured");

    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(industry ? { industry: { slug: industry } } : {}),
        ...(category ? { category: { slug: category } } : {}),
        ...(featured === "true" ? { featured: true } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { brand: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { sku: { contains: q, mode: "insensitive" } },
                { ean: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true, industry: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao carregar produtos" },
      { status: 500 },
    );
  }
}
