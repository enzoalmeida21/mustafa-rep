"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL, hasListPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function IndustryProductList({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white/70 px-6 py-10 text-center text-[var(--ink-soft)]">
        Nenhum produto cadastrado neste hall ainda.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white/80 shadow-[var(--shadow-soft)]">
      <div className="hidden grid-cols-[72px_1.7fr_0.75fr_0.75fr_0.75fr_auto] gap-3 border-b border-[var(--line)] px-5 py-3.5 text-[0.65rem] font-semibold tracking-[0.16em] text-[var(--ink-soft)] uppercase md:grid">
        <span />
        <span>Produto</span>
        <span>SKU / EAN</span>
        <span>Embalagem</span>
        <span>Preço</span>
        <span className="text-right">Pedido</span>
      </div>

      <ul className="divide-y divide-[var(--line)]">
        {products.map((product) => (
          <li
            key={product.id}
            className="grid gap-4 px-4 py-4 transition hover:bg-[rgba(59,19,87,0.02)] md:grid-cols-[72px_1.7fr_0.75fr_0.75fr_0.75fr_auto] md:items-center md:gap-3 md:px-5"
          >
            <Link
              href={`/produto/${product.slug}`}
              className="relative mx-auto h-[4.5rem] w-[4.5rem] overflow-hidden rounded-[10px] bg-[var(--paper-deep)] md:mx-0"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-1.5"
                  sizes="72px"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[0.6rem] tracking-[0.1em] text-[var(--ink-soft)] uppercase">
                  —
                </span>
              )}
            </Link>

            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
                {product.brand ?? "Mustafá"}
              </p>
              <Link
                href={`/produto/${product.slug}`}
                className="mt-1 block text-[0.98rem] font-medium leading-snug text-[var(--ink)] transition hover:text-[var(--forest)]"
              >
                {product.name}
              </Link>
            </div>

            <div className="font-mono text-[0.78rem] leading-relaxed text-[var(--ink-soft)]">
              <p>{product.sku ?? "—"}</p>
              <p className="opacity-80">{product.ean ?? "—"}</p>
            </div>

            <div className="text-sm text-[var(--ink-soft)]">
              <p className="font-medium text-[var(--ink)]">
                {product.packLabel ?? product.unit}
              </p>
            </div>

            <div>
              {product.compareAtPrice ? (
                <p className="text-xs text-[var(--ink-soft)] line-through">
                  {formatBRL(product.compareAtPrice)}
                </p>
              ) : null}
              <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--forest)]">
                {formatBRL(product.price)}
              </p>
              {hasListPrice(product.price) ? (
                <p className="text-[0.7rem] text-[var(--ink-soft)]">/ {product.unit}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                type="button"
                className="btn btn-primary min-h-10 px-4"
                onClick={() => addItem(product)}
              >
                Pedir
              </button>
              <Link
                href={`/produto/${product.slug}`}
                className="btn btn-secondary min-h-10 px-4"
              >
                Ver
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
