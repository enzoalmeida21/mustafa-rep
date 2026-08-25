import { HeroBanner } from "@/components/HeroBanner";
import { IndustryCarousel } from "@/components/IndustryCarousel";
import { api } from "@/lib/api";
import type { Industry } from "@/lib/types";

export default async function HomePage() {
  let industries: Industry[] = [];
  try {
    industries = await api.getIndustries();
  } catch {
    industries = [];
  }

  return (
    <div className="pb-20">
      <HeroBanner />
      <IndustryCarousel industries={industries} />

      <section className="container pb-8">
        <div className="divider-hair mb-12" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Experiência Mustafá</p>
          <h2 className="display mt-4 text-4xl text-[var(--forest)] md:text-5xl">
            Representação comercial com catálogo por indústria
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            Cada hall concentra produtos, embalagens e preços da marca — para
            decidir com clareza e enviar o pedido sem ruído.
          </p>
        </div>
      </section>
    </div>
  );
}
