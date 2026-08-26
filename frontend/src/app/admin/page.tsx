"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { formatBRL, formatDate, formatSaleQty, ORDER_STATUS_LABEL } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "novo",
  "em_analise",
  "confirmado",
  "enviado",
  "cancelado",
];

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  async function load(status?: string) {
    if (!token) return;
    try {
      setOrders(await api.adminOrders(token, status || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
    }
  }

  useEffect(() => {
    void load(filter);
  }, [token, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Pedidos</h1>
          <p className="mt-2 text-[var(--ink-soft)]">Acompanhe e atualize o status.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-h-11 border border-[var(--line)] bg-white px-3"
        >
          <option value="">Todos</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="mt-4 text-red-700">{error}</p> : null}

      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="border border-[var(--line)] bg-white/70 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{order.number}</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {order.customerName}
                  {order.company ? ` · ${order.company}` : ""} · {order.city}/{order.state}
                </p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {order.phone} · {order.email}
                </p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{formatBRL(order.total)}</p>
                <select
                  className="mt-2 min-h-10 border border-[var(--line)] bg-white px-2"
                  value={order.status}
                  onChange={async (e) => {
                    if (!token) return;
                    const updated = await api.updateOrder(token, order.id, e.target.value);
                    setOrders((prev) =>
                      prev.map((item) => (item.id === order.id ? updated : item))
                    );
                  }}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ul className="mt-4 grid gap-1 border-t border-[var(--line)] pt-3 text-sm">
              {order.items?.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span>
                    {formatSaleQty(item.quantity, item.unit)} {item.productName}
                  </span>
                  <span>{formatBRL(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            {order.notes ? (
              <p className="mt-3 text-sm text-[var(--ink-soft)]">Obs: {order.notes}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
