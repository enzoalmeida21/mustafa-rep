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
    <div className="container py-6 md:py-8">
      <div className="mb-6 rounded-[22px] border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
          Catálogo geral
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)] md:text-4xl">
          {activeName}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Preferencialmente, escolha o hall da indústria na página inicial para
          uma experiência comercial completa. Aqui você também pode buscar em
          todo o mix.
        </p>
        <Link href="/#industrias" className="btn btn-primary mt-5">
          Ir para halls por indústria
        </Link>
      </div>

      <form className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]" action="/catalogo">
        <input
          type="search"
          name="q"
          defaultValue={params.q}
          placeholder="Buscar por produto, marca, SKU ou EAN"
          className="min-h-11 rounded-full border border-[var(--line)] bg-white px-4"
        />
        {params.industry ? (
          <input type="hidden" name="industry" value={params.industry} />
        ) : null}
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/catalogo"
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            !params.industry
              ? "bg-[var(--forest)] text-white"
              : "border border-[var(--line)] bg-white text-[var(--ink)]"
          }`}
        >
          Todas
        </Link>
        {industries.map((industry) => (
          <Link
            key={industry.id}
            href={`/industria/${industry.slug}`}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              params.industry === industry.slug
                ? "bg-[var(--forest)] text-white"
                : "border border-[var(--line)] bg-white text-[var(--ink)]"
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
        <div className="mt-8 rounded-[18px] border border-[var(--line)] bg-white p-8 text-[var(--ink-soft)]">
          Nenhum produto encontrado.
          <div className="mt-4 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <Link
                key={industry.id}
                href={`/industria/${industry.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm"
              >
                {industry.logoImage ? (
                  <span className="relative h-7 w-7 overflow-hidden rounded-full bg-[var(--paper-deep)]">
                    <Image
                      src={industry.logoImage}
                      alt={industry.name}
                      fill
                      className="object-contain p-0.5"
                      sizes="28px"
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
