import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryProductList } from "@/components/IndustryProductList";
import { api } from "@/lib/api";
import { industryArt } from "@/lib/industry-art";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const industry = await api.getIndustry(slug);
    return {
      title: `Hall ${industry.name}`,
      description:
        industry.description ??
        industry.tagline ??
        `Mix ${industry.name} representado pela Mustafá. Preço por caixa.`,
      openGraph: {
        title: `${industry.name} — Mustafá Representações`,
        description:
          industry.tagline ??
          `Veja os produtos ${industry.name} que a Mustafá vende.`,
      },
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
  const art = industryArt(industry);

  return (
    <div className="pb-20">
      <section className="container pt-8 pb-4 md:pt-12">
        <Link
          href="/vitrine"
          className="inline-flex h-9 items-center text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase transition hover:text-[var(--forest)]"
        >
          ← Todas as indústrias
        </Link>

        <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
          <div>
            <p className="eyebrow">Hall comercial</p>
            <h1 className="display mt-4 text-[clamp(2.5rem,6.5vw,4.5rem)] text-[var(--forest)]">
              {industry.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              {industry.description ?? industry.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase">
                {products.length} produto{products.length === 1 ? "" : "s"}
              </span>
              <Link href="/carrinho" className="btn btn-secondary">
                Ver pedido
              </Link>
            </div>
          </div>

          {art.src ? (
            <div
              className="relative aspect-[4/3] w-full max-w-[26rem] justify-self-center overflow-hidden rounded-[var(--radius)] bg-white shadow-[var(--shadow)] md:justify-self-end"
              style={art.background ? { background: art.background } : undefined}
            >
              <Image
                src={art.src}
                alt={`Marca ${industry.name}`}
                fill
                priority
                sizes="(min-width: 768px) 26rem, 100vw"
                className={art.isMark ? "object-contain p-10" : "object-cover"}
              />
            </div>
          ) : null}
        </div>

        <div className="divider-hair mt-12" />
      </section>

      <section className="container py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2 className="display mt-2 text-3xl text-[var(--ink)] md:text-4xl">
              Lista de produtos
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
            Consulte SKU, EAN, embalagem e preço antes de montar o pedido.
          </p>
        </div>

        <IndustryProductList products={products} />
      </section>
    </div>
  );
}
