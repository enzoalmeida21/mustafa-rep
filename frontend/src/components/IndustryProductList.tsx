"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

export function IndustryProductList({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="rounded-[18px] border border-[var(--line)] bg-white p-8 text-[var(--ink-soft)]">
        Nenhum produto cadastrado neste hall ainda.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-white shadow-[var(--shadow)]">
      <div className="hidden grid-cols-[88px_1.6fr_0.7fr_0.7fr_0.8fr_auto] gap-3 border-b border-[var(--line)] bg-[var(--paper)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)] md:grid">
        <span>Foto</span>
        <span>Produto</span>
        <span>SKU / EAN</span>
        <span>Embalagem</span>
        <span>Preço</span>
        <span>Pedido</span>
      </div>

      <ul className="divide-y divide-[var(--line)]">
        {products.map((product) => (
          <li
            key={product.id}
            className="grid gap-4 px-4 py-4 md:grid-cols-[88px_1.6fr_0.7fr_0.7fr_0.8fr_auto] md:items-center md:gap-3 md:px-5"
          >
            <Link
              href={`/produto/${product.slug}`}
              className="relative mx-auto h-20 w-20 overflow-hidden rounded-xl bg-[var(--paper-deep)] md:mx-0"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                />
              ) : null}
            </Link>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                {product.brand ?? "Mustafá"}
              </p>
              <Link
                href={`/produto/${product.slug}`}
                className="mt-1 block text-base font-semibold leading-snug text-[var(--ink)] hover:text-[var(--forest)]"
              >
                {product.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--ink-soft)]">
                {product.description}
              </p>
            </div>

            <div className="text-sm text-[var(--ink-soft)]">
              <p>
                <span className="font-semibold text-[var(--ink)]">SKU:</span>{" "}
                {product.sku ?? "—"}
              </p>
              <p>
                <span className="font-semibold text-[var(--ink)]">EAN:</span>{" "}
                {product.ean ?? "—"}
              </p>
            </div>

            <div className="text-sm text-[var(--ink-soft)]">
              <p className="font-semibold text-[var(--ink)]">
                {product.packLabel ?? product.unit}
              </p>
              <p>Unidade: {product.unit}</p>
            </div>

            <div>
              {product.compareAtPrice ? (
                <p className="text-xs text-[var(--ink-soft)] line-through">
                  {formatBRL(product.compareAtPrice)}
                </p>
              ) : null}
              <p className="text-lg font-extrabold text-[var(--forest)]">
                {formatBRL(product.price)}
              </p>
              <p className="text-xs text-[var(--ink-soft)]">/ {product.unit}</p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addItem(product)}
              >
                Pedir
              </button>
              <Link href={`/produto/${product.slug}`} className="btn btn-secondary">
                Detalhes
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
