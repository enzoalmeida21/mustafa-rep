"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="container py-12 md:py-16">
      <h1 className="display text-5xl">Seu pedido</h1>
      <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
        Ajuste as quantidades e siga para o envio. Sem pagamento online — a
        Mustafá confirma depois.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 border border-[var(--line)] bg-white/55 p-8">
          <p>Seu pedido está vazio.</p>
          <Link href="/catalogo" className="btn btn-primary mt-5">
            Ir ao catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="grid gap-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="grid grid-cols-[88px_1fr] gap-4 border border-[var(--line)] bg-white/60 p-4 sm:grid-cols-[110px_1fr_auto]"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--paper-deep)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="110px"
                    />
                  ) : null}
                </div>
                <div>
                  <Link href={`/produto/${item.slug}`} className="display text-2xl">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {formatBRL(item.price)} / {item.unit}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm">
                      Qtd
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, Number(e.target.value))
                        }
                        className="ml-2 w-20 border border-[var(--line)] bg-white px-2 py-1"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-red-700 underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <p className="text-right font-semibold sm:self-center">
                  {formatBRL(Number(item.price) * item.quantity)}
                </p>
              </article>
            ))}
          </div>

          <aside className="h-fit border border-[var(--line)] bg-[var(--forest-deep)] p-6 text-[#f7f0ff]">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
              Resumo
            </p>
            <p className="mt-4 text-3xl font-semibold">{formatBRL(subtotal)}</p>
            <p className="mt-2 text-sm text-[#d8c9e8]">
              Valores de referência. Confirmação comercial após o envio do pedido.
            </p>
            <Link href="/checkout" className="btn btn-ghost mt-6 w-full">
              Continuar para envio
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
