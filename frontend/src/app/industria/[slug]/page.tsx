import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryProductList } from "@/components/IndustryProductList";
import { api } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const industry = await api.getIndustry(slug);
    return {
      title: `Hall ${industry.name}`,
      description: industry.description ?? industry.tagline ?? undefined,
    };
  } catch {
    return { title: "Indústria" };
  }
}

export default async function IndustryHallPage({ params }: Props) {
  const { slug } = await params;
  let industry;
  try {
    industry = await api.getIndustry(slug);
  } catch {
    notFound();
  }

  const products = industry.products ?? [];

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-[var(--forest-deep)]">
        <div className="relative min-h-[340px] md:min-h-[420px]">
          {industry.coverImage ? (
            <Image
              src={industry.coverImage}
              alt={`Hall ${industry.name}`}
              fill
              priority
              className="object-cover opacity-55"
              sizes="100vw"
            />
          ) : null}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(120deg, rgba(20,6,32,0.92) 0%, rgba(20,6,32,0.7) 45%, ${industry.accentColor}88 100%)`,
            }}
          />
          <div className="container relative z-10 flex min-h-[340px] flex-col justify-end pb-10 pt-16 text-white md:min-h-[420px] md:pb-12">
            <Link
              href="/#industrias"
              className="mb-5 w-fit text-xs font-bold uppercase tracking-[0.16em] text-white/75 hover:text-[var(--gold)]"
            >
              ← Todas as indústrias
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
              Hall comercial
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              {industry.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {industry.description ?? industry.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span
                className="rounded-full px-3 py-1.5 font-bold text-white"
                style={{ background: industry.accentColor }}
              >
                {products.length} produto{products.length === 1 ? "" : "s"}
              </span>
              <Link href="/carrinho" className="btn btn-ghost">
                Ver pedido
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-12">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
              Catálogo da indústria
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)] md:text-3xl">
              Lista detalhada de produtos
            </h2>
          </div>
          <p className="text-sm text-[var(--ink-soft)]">
            Consulte SKU, EAN, embalagem e preço antes de pedir.
          </p>
        </div>

        <IndustryProductList products={products} />
      </section>
    </div>
  );
}
