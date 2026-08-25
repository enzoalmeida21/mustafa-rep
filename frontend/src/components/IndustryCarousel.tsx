"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Industry } from "@/lib/types";

export function IndustryCarousel({ industries }: { industries: Industry[] }) {
  const [active, setActive] = useState(0);
  const count = industries.length;
  const current = industries[active];

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % count);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) {
    return (
      <section id="industrias" className="container py-20 text-center text-[var(--ink-soft)]">
        Nenhuma indústria cadastrada ainda.
      </section>
    );
  }

  return (
    <section id="industrias" className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(59,19,87,0.14),transparent)]" />

      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="eyebrow">Halls comerciais</p>
          <h2 className="display mt-4 text-5xl text-[var(--forest)] md:text-6xl">
            Escolha a indústria
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            Navegue pelas marcas representadas e entre no catálogo detalhado.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden">
            {industries.map((industry, index) => {
              const isActive = index === active;
              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Selecionar ${industry.name}`}
                  className={`group relative shrink-0 overflow-hidden rounded-full border bg-white transition-all duration-500 ${
                    isActive
                      ? "h-[7.5rem] w-[7.5rem] border-[var(--gold)] shadow-[0_20px_50px_rgba(26,10,40,0.14)] md:h-36 md:w-36"
                      : "h-[4.75rem] w-[4.75rem] border-[var(--line)] opacity-55 hover:opacity-90 md:h-[5.5rem] md:w-[5.5rem]"
                  }`}
                >
                  {industry.logoImage ? (
                    <Image
                      src={industry.logoImage}
                      alt={industry.name}
                      fill
                      className="object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
                      sizes="144px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center px-2 text-center text-[0.7rem] font-semibold leading-tight text-[var(--forest)] md:text-xs">
                      {industry.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            key={current.id}
            className="fade-rise mx-auto mt-10 max-w-xl text-center md:mt-12"
          >
            <p className="eyebrow">Hall {current.name}</p>
            <h3 className="display mt-3 text-4xl text-[var(--forest)] md:text-5xl">
              {current.name}
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
              {current.tagline ?? current.description}
            </p>
            <p className="mt-3 text-xs font-medium tracking-[0.14em] text-[var(--ink-soft)] uppercase">
              {current._count?.products ?? 0} produto
              {(current._count?.products ?? 0) === 1 ? "" : "s"}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActive((active - 1 + count) % count)}
                aria-label="Indústria anterior"
              >
                Anterior
              </button>
              <Link href={`/industria/${current.slug}`} className="btn btn-primary">
                Entrar no hall
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActive((active + 1) % count)}
                aria-label="Próxima indústria"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
