import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Industry, Product } from "@/lib/types";

type SearchParams = Promise<{ industry?: string; q?: string }>;

export const metadata = {
  title: "Catálogo",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let industries: Industry[] = [];
  let products: Product[] = [];

  try {
    [industries, products] = await Promise.all([
      api.getIndustries(),
      api.getProducts({ industry: params.industry, q: params.q }),
    ]);
  } catch {
    industries = [];
    products = [];
  }

  const activeName =
    industries.find((industry) => industry.slug === params.industry)?.name ??
    "Todas as indústrias";

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow">Catálogo geral</p>
        <h1 className="display mt-3 text-5xl text-[var(--forest)] md:text-6xl">
          {activeName}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
          Busque em todo o mix ou entre no hall de cada indústria para uma
          consulta mais focada.
        </p>
        <Link href="/#industrias" className="btn btn-primary mt-6">
          Ver halls por indústria
        </Link>
      </div>

      <form
        className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]"
        action="/catalogo"
      >
        <input
          type="search"
          name="q"
          defaultValue={params.q}
          placeholder="Buscar por produto, marca, SKU ou EAN"
          className="min-h-11 rounded-full border border-[var(--line)] bg-white/80 px-5 text-sm outline-none transition focus:border-[var(--gold)] focus:shadow-[0_0_0_3px_rgba(201,162,74,0.14)]"
        />
        {params.industry ? (
          <input type="hidden" name="industry" value={params.industry} />
        ) : null}
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/catalogo"
          className={`whitespace-nowrap rounded-full px-4 py-2 text-[0.78rem] font-medium transition ${
            !params.industry
              ? "bg-[var(--forest)] text-white"
              : "border border-[var(--line)] bg-white/70 text-[var(--ink-soft)] hover:text-[var(--forest)]"
          }`}
        >
          Todas
        </Link>
        {industries.map((industry) => (
          <Link
            key={industry.id}
            href={`/industria/${industry.slug}`}
            className={`whitespace-nowrap rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-[0.78rem] font-medium text-[var(--ink-soft)] transition hover:text-[var(--forest)] ${
              params.industry === industry.slug
                ? "border-[var(--forest)] text-[var(--forest)]"
                : ""
            }`}
          >
            {industry.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius)] border border-[var(--line)] bg-white/70 px-6 py-10 text-center text-[var(--ink-soft)]">
          Nenhum produto encontrado.
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {industries.map((industry) => (
              <Link
                key={industry.id}
                href={`/industria/${industry.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
              >
                {industry.logoImage ? (
                  <span className="relative h-6 w-6 overflow-hidden rounded-full bg-[var(--paper-deep)]">
                    <Image
                      src={industry.logoImage}
                      alt=""
                      fill
                      className="object-contain p-0.5"
                      sizes="24px"
                    />
                  </span>
                ) : null}
                {industry.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
