import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductRail({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="container py-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Catálogo
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--ink)] md:text-2xl">
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="text-sm font-bold text-[var(--forest)] underline-offset-4 hover:underline"
        >
          Ver mais
        </Link>
      </div>
      <div className="product-rail">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
