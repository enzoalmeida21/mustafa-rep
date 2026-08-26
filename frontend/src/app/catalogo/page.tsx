import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Industry, Product } from "@/lib/types";

type SearchParams = Promise<{ industry?: string; q?: string }>;

export const metadata = {
  title: "Catálogo",
};

function chipHref(industry?: string, q?: string) {
  const params = new URLSearchParams();
  if (industry) params.set("industry", industry);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let industries: Industry[] = [];
  let products: Product[] = [];
  let failed = false;

  try {
    [industries, products] = await Promise.all([
      api.getIndustries(),
      api.getProducts({ industry: params.industry, q: params.q }),
    ]);
  } catch {
    failed = true;
  }

  const active = industries.find(
    (industry) => industry.slug === params.industry,
  );
  const heading = active?.name ?? "Todas as indústrias";

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Catálogo geral</p>
        <h1 className="display mt-4 text-[clamp(2.25rem,5.5vw,3.75rem)] text-[var(--forest)]">
          {heading}
        </h1>
        <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
          Busque em todo o mix ou entre no hall de cada indústria para uma
          consulta mais focada.
        </p>
      </div>

      <form className="mt-10 flex flex-wrap gap-3" action="/catalogo">
        <div className="flex min-w-0 flex-1 items-center rounded-full border border-[var(--line-strong)] bg-white/80 transition focus-within:border-[var(--gold)] focus-within:shadow-[0_0_0_3px_rgba(150,112,31,0.13)] sm:max-w-md">
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            aria-label="Buscar por produto, marca, SKU ou EAN"
            placeholder="Produto, marca, SKU ou EAN"
            className="h-11 w-full min-w-0 bg-transparent px-5 text-sm outline-none placeholder:text-[var(--ink-mute)]"
          />
        </div>
        {params.industry ? (
          <input type="hidden" name="industry" value={params.industry} />
        ) : null}
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <nav aria-label="Filtrar por indústria" className="scroll-x mt-6 -mx-1 px-1 py-1">
        <Link
          href={chipHref(undefined, params.q)}
          aria-current={!params.industry ? "page" : undefined}
          className={`inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-[0.78rem] font-medium transition ${
            !params.industry
              ? "border-[var(--forest)] bg-[var(--forest)] text-white"
              : "border-[var(--line-strong)] bg-white/70 text-[var(--ink-soft)] hover:border-[var(--forest)] hover:text-[var(--forest)]"
          }`}
        >
          Todas
        </Link>
        {industries.map((industry) => {
          const isActive = params.industry === industry.slug;
          return (
            <Link
              key={industry.id}
              href={chipHref(industry.slug, params.q)}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-[0.78rem] font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                  : "border-[var(--line-strong)] bg-white/70 text-[var(--ink-soft)] hover:border-[var(--forest)] hover:text-[var(--forest)]"
              }`}
            >
              {industry.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
        <p
          aria-live="polite"
          className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase"
        >
          {products.length} {products.length === 1 ? "produto" : "produtos"}
          {params.q ? ` para “${params.q}”` : ""}
        </p>
        {active ? (
          <Link
            href={`/industria/${active.slug}`}
            className="text-[0.72rem] font-semibold tracking-[0.1em] text-[var(--forest)] uppercase transition hover:text-[var(--gold)]"
          >
            Ver hall {active.name} →
          </Link>
        ) : null}
      </div>

      {products.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface mt-6 rounded-[var(--radius)] px-6 py-14 text-center">
          <p className="text-[var(--ink-soft)]">
            {failed
              ? "Não foi possível carregar o catálogo agora. Tente novamente em instantes."
              : "Nenhum produto encontrado para esta busca."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {params.q || params.industry ? (
              <Link href="/catalogo" className="btn btn-secondary">
                Limpar filtros
              </Link>
            ) : null}
            <Link href="/#industrias" className="btn btn-primary">
              Ver halls por indústria
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
