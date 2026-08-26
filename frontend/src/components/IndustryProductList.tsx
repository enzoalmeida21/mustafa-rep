"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL, formatProductName, hasListPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const COLUMNS = "md:grid-cols-[4.5rem_1.6fr_0.8fr_0.8fr_0.9fr_auto]";

function Thumb({ product }: { product: Product }) {
  return (
    <Link
      href={`/produto/${product.slug}`}
      tabIndex={-1}
      aria-hidden
      className="relative block h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)]"
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="72px"
          className="object-contain p-1.5"
        />
      ) : (
        <span className="brand-tile">
          <span className="brand-tile-mark text-[1.15rem]">
            {(product.brand ?? product.name).trim().slice(0, 2).toUpperCase()}
          </span>
        </span>
      )}
    </Link>
  );
}

function Price({ product }: { product: Product }) {
  if (!hasListPrice(product.price)) {
    return (
      <p className="text-[0.8rem] font-semibold tracking-[0.06em] text-[var(--gold)] uppercase">
        Sob consulta
      </p>
    );
  }
  return (
    <>
      {product.compareAtPrice && hasListPrice(product.compareAtPrice) ? (
        <p className="text-xs text-[var(--ink-mute)] line-through">
          {formatBRL(product.compareAtPrice)}
        </p>
      ) : null}
      <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--forest)]">
        {formatBRL(product.price)}
        <span className="ml-1 text-[0.7rem] font-medium text-[var(--ink-mute)]">
          / {product.unit}
        </span>
      </p>
    </>
  );
}

export function IndustryProductList({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="surface rounded-[var(--radius)] px-6 py-12 text-center">
        <p className="text-[var(--ink-soft)]">
          Nenhum produto cadastrado neste hall ainda.
        </p>
        <Link href="/catalogo" className="btn btn-secondary mt-6">
          Ver catálogo completo
        </Link>
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden rounded-[var(--radius)]">
      <div
        className={`hidden gap-3 border-b border-[var(--line)] bg-white/50 px-5 py-3.5 text-[0.62rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase md:grid ${COLUMNS}`}
      >
        <span aria-hidden />
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
            className={`grid gap-4 px-4 py-5 transition hover:bg-[rgba(59,19,87,0.022)] md:items-center md:gap-3 md:px-5 md:py-4 ${COLUMNS}`}
          >
            {/* Mobile: miniatura e identificação lado a lado. */}
            <div className="flex items-start gap-4 md:hidden">
              <Thumb product={product} />
              <div className="min-w-0 flex-1">
                <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase">
                  {product.brand ?? "Mustafá"}
                </p>
                <Link
                  href={`/produto/${product.slug}`}
                  className="mt-1 block text-[0.95rem] font-medium leading-snug text-[var(--ink)] transition hover:text-[var(--forest)]"
                >
                  {formatProductName(product.name)}
                </Link>
                <div className="mt-2">
                  <Price product={product} />
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <Thumb product={product} />
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase">
                {product.brand ?? "Mustafá"}
              </p>
              <Link
                href={`/produto/${product.slug}`}
                className="mt-1 block text-[0.95rem] font-medium leading-snug text-[var(--ink)] transition hover:text-[var(--forest)]"
              >
                {formatProductName(product.name)}
              </Link>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[0.78rem] md:block md:text-[0.76rem]">
              <dt className="text-[0.6rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase md:sr-only">
                SKU
              </dt>
              <dt className="text-[0.6rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase md:sr-only">
                EAN
              </dt>
              <dd className="font-mono text-[var(--ink-soft)]">
                {product.sku ?? "—"}
              </dd>
              <dd className="font-mono text-[var(--ink-mute)]">
                {product.ean ?? "—"}
              </dd>
            </dl>

            <div className="text-[0.82rem] md:text-sm">
              <span className="mr-2 text-[0.6rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase md:hidden">
                Embalagem
              </span>
              <span className="font-medium text-[var(--ink)]">
                {product.packLabel ?? product.unit}
              </span>
            </div>

            <div className="hidden md:block">
              <Price product={product} />
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
