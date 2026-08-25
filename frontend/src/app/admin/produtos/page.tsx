"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { formatBRL } from "@/lib/format";
import { uploadProductImage } from "@/lib/supabase";
import type { Category, Product } from "@/lib/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!token) return;
    const [productList, categoryList] = await Promise.all([
      api.adminProducts(token),
      api.adminCategories(token),
    ]);
    setProducts(productList);
    setCategories(categoryList);
  }

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Erro ao carregar")
    );
  }, [token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      const name = String(form.get("name"));
      const file = (form.get("image") as File | null) ?? null;
      let imageUrl: string | null = String(form.get("imageUrl") || "") || null;

      if (file && file.size > 0) {
        try {
          imageUrl = await uploadProductImage(file);
        } catch {
          // Allow manual URL fallback if Storage is not configured yet
          if (!imageUrl) {
            throw new Error(
              "Falha no upload. Configure o bucket 'products' no Supabase Storage ou informe uma URL."
            );
          }
        }
      }

      await api.createProduct(token, {
        name,
        slug: slugify(name),
        description: String(form.get("description")),
        price: Number(form.get("price")),
        unit: String(form.get("unit") || "un"),
        categoryId: String(form.get("categoryId")),
        imageUrl,
        featured: form.get("featured") === "on",
        active: true,
      });
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <h1 className="display text-4xl">Produtos</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 border border-[var(--line)] bg-white/70 p-5">
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="description">Descrição</label>
            <textarea id="description" name="description" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="field">
              <label htmlFor="price">Preço</label>
              <input id="price" name="price" type="number" step="0.01" min="0.01" required />
            </div>
            <div className="field">
              <label htmlFor="unit">Unidade</label>
              <input id="unit" name="unit" defaultValue="un" required />
            </div>
            <div className="field">
              <label htmlFor="categoryId">Categoria</label>
              <select id="categoryId" name="categoryId" required>
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="image">Imagem (Supabase Storage)</label>
            <input id="image" name="image" type="file" accept="image/*" />
          </div>
          <div className="field">
            <label htmlFor="imageUrl">Ou URL da imagem</label>
            <input id="imageUrl" name="imageUrl" type="url" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" />
            Destacar na home
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Criar produto"}
          </button>
        </form>
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <article key={product.id} className="border border-[var(--line)] bg-white/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {product.category?.name} · {formatBRL(product.price)} / {product.unit}
                </p>
                <p className="text-xs text-[var(--ink-soft)]">
                  {product.active ? "Ativo" : "Inativo"}
                  {product.featured ? " · Destaque" : ""}
                </p>
              </div>
              <button
                type="button"
                className="text-sm underline"
                onClick={async () => {
                  if (!token) return;
                  await api.deleteProduct(token, product.id);
                  await load();
                }}
              >
                Desativar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
