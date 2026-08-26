import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

type CatalogData = {
  industries: Array<{
    key: string;
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    coverImage?: string | null;
    logoImage?: string | null;
    accentColor?: string;
    sortOrder?: number;
  }>;
  categories: Array<{
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
  }>;
  products: Array<{
    brand?: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    unit?: string;
    packLabel?: string | null;
    ean?: string | null;
    sku?: string | null;
    featured?: boolean;
    industryKey: string;
    categorySlug: string;
    imageUrl?: string | null;
  }>;
};

async function main() {
  const catalogPath = join(__dirname, "catalog-data.json");
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8")) as CatalogData;

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.industry.deleteMany();

  const industryIds = new Map<string, string>();
  for (const industry of catalog.industries) {
    const created = await prisma.industry.create({
      data: {
        name: industry.name,
        slug: industry.slug,
        tagline: industry.tagline,
        description: industry.description,
        coverImage: industry.coverImage ?? undefined,
        logoImage: industry.logoImage ?? undefined,
        accentColor: industry.accentColor ?? "#3b1357",
        sortOrder: industry.sortOrder ?? 0,
      },
    });
    industryIds.set(industry.key, created.id);
  }

  const categoryIds = new Map<string, string>();
  for (const category of catalog.categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder ?? 0,
      },
    });
    categoryIds.set(category.slug, created.id);
  }

  const rows = catalog.products
    .map((product) => {
      const industryId = industryIds.get(product.industryKey);
      if (!industryId) return null;
      return {
        brand: product.brand,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        unit: product.unit ?? "cx",
        packLabel: product.packLabel ?? undefined,
        ean: product.ean ?? undefined,
        sku: product.sku ?? undefined,
        featured: Boolean(product.featured),
        industryId,
        categoryId: categoryIds.get(product.categorySlug) ?? undefined,
        imageUrl: product.imageUrl ?? undefined,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    await prisma.product.createMany({ data: rows.slice(i, i + chunkSize) });
  }

  console.log(
    `Seed concluído: ${catalog.industries.length} indústrias, ${rows.length} produtos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
