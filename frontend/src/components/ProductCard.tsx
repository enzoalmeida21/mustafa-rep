import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/lib/format";
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
    <article className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(42,14,64,0.04)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]">
      <div className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-[var(--radius-sm)] bg-[var(--paper-deep)]">
        <Link href={`/produto/${product.slug}`} className="absolute inset-0 block">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="220px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--ink-soft)]">
              Sem imagem
            </div>
          )}
        </Link>
        {discount ? (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-[#22a06b] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            -{discount}%
          </span>
        ) : product.featured ? (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--forest-deep)]">
            Destaque
          </span>
        ) : null}
        <AddToCartButton product={product} icon />
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-4 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]">
          {product.brand ?? product.category?.name ?? "Mustafá"}
        </p>
        <Link
          href={`/produto/${product.slug}`}
          className="line-clamp-2 text-sm font-bold leading-snug text-[var(--ink)]"
        >
          {product.name}
        </Link>
        <p className="text-xs text-[var(--ink-soft)]">
          {product.packLabel ?? `Por ${product.unit}`}
        </p>
        <div className="mt-auto pt-2">
          {product.compareAtPrice ? (
            <p className="text-xs text-[var(--ink-soft)] line-through">
              {formatBRL(product.compareAtPrice)}
            </p>
          ) : null}
          <p className="text-lg font-extrabold text-[var(--forest)]">
            {formatBRL(product.price)}
            <span className="ml-1 text-xs font-semibold text-[var(--ink-soft)]">
              / {product.unit}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
