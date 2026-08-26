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
            Cada hall reúne o mix completo da marca, com embalagem, código e
            preço lado a lado.
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
              const cover = industry.coverImage ?? industry.logoImage ?? null;
              return (
                <li key={industry.id}>
                  <Link
                    href={`/industria/${industry.slug}`}
                    className="group surface flex h-full flex-col overflow-hidden rounded-[var(--radius)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow)]"
                  >
                    {/* A foto de PDV é o único ativo visual consistente: os
                        campos logoImage apontam para fotos de produto. */}
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--line)]">
                      {cover ? (
                        <>
                          <Image
                            src={cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.05]"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(26,10,40,0.42)_0%,rgba(26,10,40,0.06)_55%,transparent_100%)]"
                          />
                        </>
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
