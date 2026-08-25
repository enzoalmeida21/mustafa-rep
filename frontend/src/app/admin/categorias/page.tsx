"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import type { Category } from "@/lib/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  async function load() {
    if (!token) return;
    setCategories(await api.adminCategories(token));
  }

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Erro ao carregar")
    );
  }, [token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    await api.createCategory(token, {
      name,
      slug: slugify(name),
      description: String(form.get("description") || "") || null,
    });
    event.currentTarget.reset();
    await load();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h1 className="display text-4xl">Categorias</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 border border-[var(--line)] bg-white/70 p-5">
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="description">Descrição</label>
            <textarea id="description" name="description" />
          </div>
          <button type="submit" className="btn btn-primary">
            Criar categoria
          </button>
        </form>
      </div>
      <div>
        {error ? <p className="mb-4 text-red-700">{error}</p> : null}
        <div className="grid gap-3">
          {categories.map((category) => (
            <article key={category.id} className="border border-[var(--line)] bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-[var(--ink-soft)]">/{category.slug}</p>
                </div>
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={async () => {
                    if (!token) return;
                    await api.updateCategory(token, category.id, {
                      active: !category.active,
                    });
                    await load();
                  }}
                >
                  {category.active ? "Desativar" : "Ativar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
