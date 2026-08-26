import Image from "next/image";
import Link from "next/link";
import type { Industry } from "@/lib/types";

function initials(name: string) {
  return name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function IndustryGrid({ industries }: { industries: Industry[] }) {
  return (
    <section id="industrias" className="scroll-mt-24 py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="eyebrow">Halls comerciais</p>
          <h2 className="display mt-4 text-[clamp(2.25rem,5vw,3.5rem)] text-[var(--forest)]">
            Escolha a indústria
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            Atendimento no Maranhão e no Nordeste. Cada hall reúne o mix da
            marca, com embalagem, código e preço lado a lado.
          </p>
        </div>

        {industries.length === 0 ? (
          <div className="surface mt-10 rounded-[var(--radius)] px-6 py-14 text-center">
            <p className="text-[var(--ink-soft)]">
              Nenhuma indústria disponível no momento.
            </p>
            <Link href="/contato" className="btn btn-secondary mt-6">
              Falar com a Mustafá
            </Link>
          </div>
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const total = industry._count?.products ?? 0;
              const art = industry.logoImage ?? industry.coverImage ?? null;
              const isMark = art?.endsWith(".png") ?? false;
              return (
                <li key={industry.id}>
                  <Link
                    href={`/industria/${industry.slug}`}
                    className="group surface flex h-full flex-col overflow-hidden rounded-[var(--radius)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow)]"
                  >
                    <div
                      className="relative aspect-[16/10] overflow-hidden border-b border-[var(--line)]"
                      style={
                        isMark
                          ? { background: industry.accentColor }
                          : undefined
                      }
                    >
                      {art ? (
                        <Image
                          src={art}
                          alt={`Marca ${industry.name}`}
                          fill
                          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                          className={
                            isMark
                              ? "object-contain p-7 transition duration-500 group-hover:scale-[1.04]"
                              : "object-cover transition duration-700 group-hover:scale-[1.04]"
                          }
                        />
                      ) : (
                        <div className="brand-tile">
                          <span className="brand-tile-mark">
                            {initials(industry.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="display text-2xl text-[var(--forest)]">
                        {industry.name}
                      </h3>
                      {industry.tagline || industry.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                          {industry.tagline ?? industry.description}
                        </p>
                      ) : null}

                      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                        <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase">
                          {total} {total === 1 ? "produto" : "produtos"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.1em] text-[var(--forest)] uppercase">
                          Entrar
                          <span
                            aria-hidden
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
