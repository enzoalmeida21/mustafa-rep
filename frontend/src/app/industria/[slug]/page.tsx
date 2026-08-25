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
    <div className="pb-20">
      <section className="relative overflow-hidden bg-[var(--forest-deep)]">
        <div className="relative min-h-[360px] md:min-h-[440px]">
          {industry.coverImage ? (
            <Image
              src={industry.coverImage}
              alt=""
              fill
              priority
              className="object-cover opacity-45"
              sizes="100vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,5,26,0.9)_0%,rgba(26,10,40,0.62)_55%,rgba(26,10,40,0.35)_100%)]" />
          <div className="container relative z-10 flex min-h-[360px] flex-col justify-end pb-12 pt-20 text-white md:min-h-[440px]">
            <Link
              href="/#industrias"
              className="mb-6 w-fit text-[0.7rem] font-semibold tracking-[0.18em] text-white/65 uppercase transition hover:text-[var(--gold-soft)]"
            >
              ← Todas as indústrias
            </Link>
            <p className="eyebrow text-[var(--gold-soft)]">Hall comercial</p>
            <h1 className="display mt-3 text-[clamp(3rem,8vw,5.5rem)]">
              {industry.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {industry.description ?? industry.tagline}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
                {products.length} produto{products.length === 1 ? "" : "s"}
              </span>
              <Link href="/carrinho" className="btn btn-ghost">
                Ver pedido
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
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
