import Image from "next/image";
import Link from "next/link";
import { formatBRL, hasListPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

function discountPercent(product: Product) {
  if (!product.compareAtPrice) return null;
  const current = Number(product.price);
  const previous = Number(product.compareAtPrice);
  if (!previous || previous <= current) return null;
  return Math.round(((previous - current) / previous) * 100);
}

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-soft)]">
      <div className="relative mx-2.5 mt-2.5 aspect-square overflow-hidden rounded-[var(--radius-sm)] bg-[linear-gradient(160deg,#f4eef7_0%,#faf7fb_100%)]">
        <Link href={`/produto/${product.slug}`} className="absolute inset-0 block">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
              sizes="220px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs tracking-[0.08em] text-[var(--ink-soft)] uppercase">
              Sem imagem
            </div>
          )}
        </Link>
        {discount ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 text-[0.65rem] font-semibold tracking-[0.12em] text-[#1f7a52] uppercase">
            −{discount}%
          </span>
        ) : product.featured ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--gold)] uppercase">
            Destaque
          </span>
        ) : null}
        <AddToCartButton product={product} icon />
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3.5 pb-4 pt-3">
        <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
          {product.brand ?? product.category?.name ?? "Mustafá"}
        </p>
        <Link
          href={`/produto/${product.slug}`}
          className="line-clamp-2 text-[0.92rem] font-medium leading-snug text-[var(--ink)] transition hover:text-[var(--forest)]"
        >
          {product.name}
        </Link>
        <p className="text-xs text-[var(--ink-soft)]">
          {product.packLabel ?? `Por ${product.unit}`}
        </p>
        <div className="mt-auto pt-2.5">
          {product.compareAtPrice ? (
            <p className="text-xs text-[var(--ink-soft)] line-through">
              {formatBRL(product.compareAtPrice)}
            </p>
          ) : null}
          <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--forest)]">
            {formatBRL(product.price)}
            {hasListPrice(product.price) ? (
              <span className="ml-1 text-[0.7rem] font-medium text-[var(--ink-soft)]">
                / {product.unit}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </article>
  );
}
