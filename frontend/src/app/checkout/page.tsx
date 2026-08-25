"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";

const UF = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      const order = await api.createOrder({
        customerName: String(form.get("customerName")),
        company: String(form.get("company") || "") || null,
        city: String(form.get("city")),
        state: String(form.get("state")),
        phone: String(form.get("phone")),
        email: String(form.get("email")),
        notes: String(form.get("notes") || "") || null,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      clear();
      const qs = new URLSearchParams({
        number: order.number,
        ...(order.whatsappUrl ? { wa: order.whatsappUrl } : {}),
      });
      router.push(`/pedido/sucesso?${qs.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar o pedido");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <h1 className="display text-5xl">Checkout</h1>
        <p className="mt-4 text-[var(--ink-soft)]">Seu pedido está vazio.</p>
        <Link href="/catalogo" className="btn btn-primary mt-6">
          Ir ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
      <div>
        <h1 className="display text-5xl">Enviar pedido</h1>
        <p className="mt-3 text-[var(--ink-soft)]">
          Preencha seus dados. A Mustafá recebe o pedido e confirma em seguida.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <div className="field">
            <label htmlFor="customerName">Nome completo</label>
            <input id="customerName" name="customerName" required />
          </div>
          <div className="field">
            <label htmlFor="company">Empresa (opcional)</label>
            <input id="company" name="company" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <input id="city" name="city" required />
            </div>
            <div className="field">
              <label htmlFor="state">UF</label>
              <select id="state" name="state" required defaultValue="SP">
                {UF.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="phone">Telefone / WhatsApp</label>
              <input id="phone" name="phone" required placeholder="11999999999" />
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" placeholder="Horário, condições, referências..." />
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar pedido"}
          </button>
        </form>
      </div>

      <aside className="h-fit border border-[var(--line)] bg-white/60 p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]">
          Itens
        </p>
        <ul className="mt-4 grid gap-3">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3 text-sm">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span className="font-medium">
                {formatBRL(Number(item.price) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-[var(--line)] pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
