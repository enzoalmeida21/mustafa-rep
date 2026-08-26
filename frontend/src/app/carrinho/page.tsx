"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import {
  formatBRL,
  formatProductName,
  formatSaleUnit,
  hasListPrice,
} from "@/lib/format";

export default function CartPage() {
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="container py-12 md:py-16">
      <p className="eyebrow">Pedido</p>
      <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.25rem)] text-[var(--forest)]">
        Seu pedido
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-[var(--ink-soft)]">
        Ajuste as caixas e siga para o envio. Sem pagamento online — a
        Mustafá confirma o atendimento depois.
      </p>

      {items.length === 0 ? (
        <div className="surface mt-10 rounded-[var(--radius)] px-6 py-12 text-center">
          <p className="text-[var(--ink-soft)]">Seu pedido está vazio.</p>
          <Link href="/catalogo" className="btn btn-primary mt-6">
            Ir ao catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.5fr_0.75fr]">
          <ul className="grid gap-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="surface rounded-[var(--radius)] p-4"
              >
                <div className="flex gap-4">
                  <Link
                    href={`/produto/${item.slug}`}
                    tabIndex={-1}
                    aria-hidden
                    className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)]"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        sizes="88px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="brand-tile">
                        <span className="brand-tile-mark text-[1.25rem]">
                          {item.name.trim().slice(0, 2).toUpperCase()}
                        </span>
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <Link
                        href={`/produto/${item.slug}`}
                        className="text-[0.98rem] font-medium leading-snug text-[var(--ink)] transition hover:text-[var(--forest)]"
                      >
                        {formatProductName(item.name)}
                      </Link>
                      <p className="shrink-0 text-[0.98rem] font-semibold text-[var(--forest)]">
                        {formatBRL(Number(item.price) * item.quantity)}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-[var(--ink-mute)]">
                      {formatBRL(item.price)}
                      {hasListPrice(item.price)
                        ? ` / ${formatSaleUnit(item.unit)}`
                        : ""}
                      {item.packLabel ? ` · ${item.packLabel}` : ""}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="inline-flex items-center rounded-full border border-[var(--line-strong)] bg-white">
                        <button
                          type="button"
                          aria-label={`Diminuir caixas de ${item.name}`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--paper-deep)] disabled:opacity-35"
                        >
                          <span aria-hidden>−</span>
                        </button>
                        <label className="sr-only" htmlFor={`qtd-${item.productId}`}>
                          Caixas de {item.name}
                        </label>
                        <input
                          id={`qtd-${item.productId}`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, Number(event.target.value) || 1),
                            )
                          }
                          className="h-9 w-11 border-x border-[var(--line)] bg-transparent text-center text-sm font-semibold text-[var(--ink)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          aria-label={`Aumentar caixas de ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--paper-deep)]"
                        >
                          <span aria-hidden>+</span>
                        </button>
                      </div>
                      <span className="text-xs font-semibold tracking-[0.12em] text-[var(--ink-mute)] uppercase">
                        cx
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="inline-flex h-9 items-center rounded-full px-2 text-sm text-[var(--ink-mute)] transition hover:text-[#b3261e]"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-[var(--radius)] bg-[var(--forest-deep)] p-7 text-white lg:sticky lg:top-24">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-[var(--gold-soft)] uppercase">
              Resumo
            </p>
            <p className="mt-1.5 text-sm text-white/60">
              {count} {count === 1 ? "caixa" : "caixas"}
            </p>
            <p className="display mt-4 text-4xl">{formatBRL(subtotal)}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Valores de referência. Confirmação comercial após o envio do
              pedido.
            </p>
            <Link href="/checkout" className="btn btn-gold mt-7 w-full">
              Continuar para envio
            </Link>
            <Link
              href="/catalogo"
              className="mt-4 block text-center text-[0.72rem] font-semibold tracking-[0.12em] text-white/60 uppercase transition hover:text-white"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
