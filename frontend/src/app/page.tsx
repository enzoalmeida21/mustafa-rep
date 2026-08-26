import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import { IndustryGrid } from "@/components/IndustryGrid";
import { api } from "@/lib/api";
import type { Industry } from "@/lib/types";

const pillars = [
  {
    title: "Catálogo por indústria",
    body: "Cada marca em um hall próprio, com o mix organizado por categoria.",
  },
  {
    title: "Informação completa",
    body: "SKU, EAN, embalagem e unidade de venda visíveis antes do pedido.",
  },
  {
    title: "Pedido direto",
    body: "Monte o pedido, envie e a Mustafá confirma o atendimento em seguida.",
  },
];

export default async function HomePage() {
  let industries: Industry[] = [];
  try {
    industries = await api.getIndustries();
  } catch {
    industries = [];
  }

  const productCount = industries.reduce(
    (total, industry) => total + (industry._count?.products ?? 0),
    0,
  );

  return (
    <>
      <HeroBanner
        industryCount={industries.length}
        productCount={productCount}
      />

      <div className="container">
        <div className="divider-hair" />
      </div>

      <IndustryGrid industries={industries} />

      <section className="container pb-20 md:pb-28">
        <div className="divider-hair mb-16" />
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Experiência Mustafá</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3rem)] text-[var(--forest)]">
              Representação comercial sem ruído
            </h2>
            <Link href="/contato" className="btn btn-secondary mt-8">
              Falar com a Mustafá
            </Link>
          </div>

          <ul className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            {pillars.map((pillar, index) => (
              <li key={pillar.title}>
                <span className="display block text-2xl text-[var(--gold)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[0.95rem] font-semibold text-[var(--ink)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
