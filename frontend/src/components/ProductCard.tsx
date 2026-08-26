import Image from "next/image";
import Link from "next/link";
import { formatBRL, formatProductName, hasListPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

function discountPercent(product: Product) {
  if (!product.compareAtPrice) return null;
  const current = Number(product.price);
  const previous = Number(product.compareAtPrice);
  if (!previous || previous <= current) return null;
  return Math.round(((previous - current) / previous) * 100);
}

function monogram(product: Product) {
  const source = product.brand ?? product.name;
  return source.trim().slice(0, 2).toUpperCase();
}

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  const label = product.brand ?? product.category?.name ?? "Mustafá";
  const name = formatProductName(product.name);

  return (
    <article className="group surface relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-square overflow-hidden border-b border-[var(--line)]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 31vw, 46vw"
            className="object-contain p-4 transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="brand-tile">
            <span className="brand-tile-mark">{monogram(product)}</span>
            <span className="brand-tile-label">{label}</span>
          </span>
        )}

        {discount ? (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#0f6b45] px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.08em] text-white uppercase">
            −{discount}%
          </span>
        ) : product.featured ? (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.08em] text-white uppercase">
            Destaque
          </span>
        ) : null}

        <AddToCartButton product={product} icon />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase">
          {label}
        </p>
        <h3 className="text-[0.92rem] font-medium leading-snug">
          {/* O ::after estende a área de clique para todo o card. */}
          <Link
            href={`/produto/${product.slug}`}
            className="line-clamp-2 text-[var(--ink)] transition after:absolute after:inset-0 hover:text-[var(--forest)]"
          >
            {name}
          </Link>
        </h3>
        <p className="text-xs text-[var(--ink-mute)]">
          {product.packLabel ?? `Por ${product.unit}`}
        </p>

        <div className="mt-auto pt-3">
          {product.compareAtPrice && hasListPrice(product.compareAtPrice) ? (
            <p className="text-xs text-[var(--ink-mute)] line-through">
              {formatBRL(product.compareAtPrice)}
            </p>
          ) : null}
          {hasListPrice(product.price) ? (
            <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--forest)]">
              {formatBRL(product.price)}
              <span className="ml-1 text-[0.7rem] font-medium text-[var(--ink-mute)]">
                / {product.unit}
              </span>
            </p>
          ) : (
            <p className="text-[0.82rem] font-semibold tracking-[0.06em] text-[var(--gold)] uppercase">
              Sob consulta
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
