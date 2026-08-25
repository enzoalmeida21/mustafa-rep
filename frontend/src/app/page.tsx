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
    <div className="pb-16">
      <HeroBanner />
      <IndustryCarousel industries={industries} />

      <section className="container pb-6">
        <div className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(135deg,#1f0a30_0%,#3b1357_55%,#5a1f7a_100%)] px-6 py-10 text-white md:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            Experiência Mustafá
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Representação comercial com catálogo por indústria
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            Gire o carrossel, escolha a marca e consulte a lista detalhada de
            produtos com SKU, EAN, embalagem e preço.
          </p>
        </div>
      </section>
    </div>
  );
}
