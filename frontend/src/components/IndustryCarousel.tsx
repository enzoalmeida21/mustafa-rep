"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Industry } from "@/lib/types";

export function IndustryCarousel({ industries }: { industries: Industry[] }) {
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(220);
  const count = industries.length;
  const step = count > 0 ? 360 / count : 0;

  useEffect(() => {
    const updateRadius = () => {
      setRadius(window.innerWidth < 768 ? 150 : 230);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [count]);

  const current = industries[active];

  if (count === 0) {
    return (
      <section id="industrias" className="container py-14 text-center text-[var(--ink-soft)]">
        Nenhuma indústria cadastrada ainda.
      </section>
    );
  }

  return (
    <section id="industrias" className="overflow-hidden py-12 md:py-16">
      <div className="container">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Representação comercial
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--forest)] md:text-5xl">
            Escolha a indústria
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            Gire o carrossel, selecione a marca e entre no hall comercial com o
            catálogo detalhado.
          </p>
        </div>

        <div className="relative mx-auto flex min-h-[360px] max-w-4xl flex-col items-center justify-center md:min-h-[430px]">
          <div
            className="relative h-[280px] w-full perspective-[1200px] md:h-[340px]"
            style={{ perspective: "1200px" }}
          >
            <div
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate(-50%, -50%) rotateY(${-active * step}deg)`,
                transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {industries.map((industry, index) => {
                const angle = index * step;
                const isActive = index === active;
                return (
                  <button
                    key={industry.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      zIndex: isActive ? 20 : 1,
                    }}
                    aria-label={`Selecionar ${industry.name}`}
                  >
                    <span
                      className={`relative flex items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-[0_18px_40px_rgba(31,10,48,0.18)] transition duration-500 ${
                        isActive
                          ? "h-36 w-36 border-[var(--gold)] md:h-44 md:w-44"
                          : "h-24 w-24 border-white/80 opacity-70 md:h-28 md:w-28"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? `0 20px 50px ${industry.accentColor}55`
                          : undefined,
                      }}
                    >
                      {industry.logoImage ? (
                        <Image
                          src={industry.logoImage}
                          alt={industry.name}
                          fill
                          className="object-contain p-3"
                          sizes="180px"
                        />
                      ) : (
                        <span className="px-2 text-center text-sm font-bold text-[var(--forest)]">
                          {industry.name}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative z-20 -mt-4 w-full max-w-xl rounded-[22px] border border-[var(--line)] bg-white/95 p-6 text-center shadow-[var(--shadow)] backdrop-blur md:-mt-2 md:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
              Hall comercial
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-[var(--forest)]">
              {current.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
              {current.tagline ?? current.description}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
              {current._count?.products ?? 0} produto
              {(current._count?.products ?? 0) === 1 ? "" : "s"} no catálogo
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActive((active - 1 + count) % count)}
                aria-label="Indústria anterior"
              >
                Anterior
              </button>
              <Link
                href={`/industria/${current.slug}`}
                className="btn btn-primary"
                style={{ background: current.accentColor, color: "#fff" }}
              >
                Entrar no hall {current.name}
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

        <div className="mt-8 flex justify-center gap-2">
          {industries.map((industry, index) => (
            <button
              key={industry.id}
              type="button"
              aria-label={industry.name}
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === active
                  ? "w-8 bg-[var(--gold)]"
                  : "w-2.5 bg-[var(--line)] hover:bg-[var(--ink-soft)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
