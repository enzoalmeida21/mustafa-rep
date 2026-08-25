import type { Category, Industry, Order, Product } from "./types";

function getApiBase() {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const isLocalhost =
    !!explicit && /localhost|127\.0\.0\.1/.test(explicit);

  // Em produção na Vercel, ignora localhost e usa as rotas /api do Next.js.
  if (process.env.VERCEL && (!explicit || isLocalhost)) {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    if (site) return `${site}/api`;
  }

  if (explicit) return explicit;
  return "http://localhost:8080";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(
      typeof error.error === "string" ? error.error : "Falha na requisição",
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  getIndustries: () => request<Industry[]>("/industries"),
  getIndustry: (slug: string) => request<Industry>(`/industries/${slug}`),
  getCategories: () => request<Category[]>("/categories"),
  getProducts: (params?: {
    category?: string;
    industry?: string;
    q?: string;
    featured?: boolean;
  }) => {
    const search = new URLSearchParams();
    if (params?.category) search.set("category", params.category);
    if (params?.industry) search.set("industry", params.industry);
    if (params?.q) search.set("q", params.q);
    if (params?.featured) search.set("featured", "true");
    const qs = search.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug: string) => request<Product>(`/products/${slug}`),
  createOrder: (body: unknown) =>
    request<Order>("/orders", { method: "POST", body: JSON.stringify(body) }),
  adminCategories: (token: string) =>
    request<Category[]>("/admin/categories", {}, token),
  createCategory: (token: string, body: unknown) =>
    request<Category>(
      "/admin/categories",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token,
    ),
  updateCategory: (token: string, id: string, body: unknown) =>
    request<Category>(
      `/admin/categories/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      token,
    ),
  adminProducts: (token: string) =>
    request<Product[]>("/admin/products", {}, token),
  createProduct: (token: string, body: unknown) =>
    request<Product>(
      "/admin/products",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token,
    ),
  updateProduct: (token: string, id: string, body: unknown) =>
    request<Product>(
      `/admin/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      token,
    ),
  deleteProduct: (token: string, id: string) =>
    request<{ ok: boolean }>(`/admin/products/${id}`, { method: "DELETE" }, token),
  adminOrders: (token: string, status?: string) =>
    request<Order[]>(
      `/admin/orders${status ? `?status=${status}` : ""}`,
      {},
      token,
    ),
  updateOrder: (token: string, id: string, status: string) =>
    request<Order>(
      `/admin/orders/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      token,
    ),
};
