"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL, hasListPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="container py-12 md:py-16">
      <p className="eyebrow">Pedido</p>
      <h1 className="display mt-3 text-5xl text-[var(--forest)]">Seu pedido</h1>
      <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
        Ajuste as quantidades e siga para o envio. Sem pagamento online — a
        Mustafá confirma depois.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius)] border border-[var(--line)] bg-white/70 px-6 py-10">
          <p className="text-[var(--ink-soft)]">Seu pedido está vazio.</p>
          <Link href="/catalogo" className="btn btn-primary mt-6">
            Ir ao catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="grid gap-3">
            {items.map((item) => (
              <article
                key={item.productId}
                className="grid grid-cols-[88px_1fr] gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-white/75 p-4 sm:grid-cols-[100px_1fr_auto]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[var(--paper-deep)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="100px"
                    />
                  ) : null}
                </div>
                <div>
                  <Link
                    href={`/produto/${item.slug}`}
                    className="text-base font-medium leading-snug text-[var(--ink)] transition hover:text-[var(--forest)]"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {formatBRL(item.price)}
                    {hasListPrice(item.price) ? ` / ${item.unit}` : ""}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm text-[var(--ink-soft)]">
                      Qtd
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, Number(e.target.value))
                        }
                        className="ml-2 w-16 rounded-md border border-[var(--line)] bg-white px-2 py-1 text-[var(--ink)]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-[var(--ink-soft)] underline-offset-2 transition hover:text-red-700 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <p className="text-right text-sm font-semibold text-[var(--forest)] sm:self-center">
                  {formatBRL(Number(item.price) * item.quantity)}
                </p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-[var(--radius)] bg-[var(--forest-deep)] p-7 text-white">
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--gold-soft)] uppercase">
              Resumo
            </p>
            <p className="display mt-4 text-4xl">{formatBRL(subtotal)}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Valores de referência. Confirmação comercial após o envio do
              pedido.
            </p>
            <Link href="/checkout" className="btn btn-gold mt-7 w-full">
              Continuar para envio
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
