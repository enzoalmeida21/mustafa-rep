import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";

const fallbackImages = [
  "/hero/expo-09.jpg",
  "/hero/expo-07.jpg",
  "/hero/expo-05.jpg",
  "/hero/expo-01.jpg",
  "/hero/expo-08.jpg",
];

export function CategoryStrip({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const items = categories.map((category, index) => {
    const sample = products.find((product) => product.categoryId === category.id);
    return {
      ...category,
      image: sample?.imageUrl || fallbackImages[index % fallbackImages.length],
    };
  });

  return (
    <section className="container py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-[var(--ink)] md:text-xl">
          Comprar por categoria
        </h2>
        <Link href="/catalogo" className="text-sm font-bold text-[var(--forest)]">
          Ver todas
        </Link>
      </div>
      <div className="category-rail">
        <Link href="/catalogo" className="grid justify-items-center gap-2 text-center">
          <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full border border-[var(--line)] bg-white shadow-sm">
            <Image
              src="/brand/logo-mustafa.png"
              alt="Todos"
              fill
              className="object-contain p-3"
              sizes="84px"
            />
          </div>
          <span className="text-xs font-semibold text-[var(--ink)]">Todos</span>
        </Link>
        {items.map((category) => (
          <Link
            key={category.id}
            href={`/catalogo?category=${category.slug}`}
            className="grid justify-items-center gap-2 text-center"
          >
            <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full border border-[var(--line)] bg-white shadow-sm">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="84px"
              />
            </div>
            <span className="line-clamp-2 text-xs font-semibold text-[var(--ink)]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
