"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/hero/expo-04.jpg",
    eyebrow: "Mustafá Representações",
    title: "Escolha a indústria. Entre no hall. Faça o pedido.",
    subtitle:
      "Experiência comercial deluxe: catálogos separados por indústria representada, com lista detalhada para o seu PDV.",
  },
  {
    src: "/hero/expo-03.jpg",
    eyebrow: "Halls comerciais",
    title: "Oliveira, Pinheirense, Casafort, Wyda e Alklin.",
    subtitle:
      "Cada marca com seu próprio ambiente de consulta, preços e pedido.",
  },
  {
    src: "/hero/expo-07.jpg",
    eyebrow: "Pedido profissional",
    title: "SKU, EAN, embalagem e preço em um só lugar.",
    subtitle:
      "Fluxo pensado para representação comercial — sem pagamento online, com confirmação Mustafá.",
  },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--forest-deep)]">
      <div className="relative h-[72vw] max-h-[620px] min-h-[420px] w-full md:h-[560px]">
        <div
          className="banner-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.src} className="banner-slide">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,6,32,0.92)] via-[rgba(31,10,48,0.62)] to-[rgba(31,10,48,0.2)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,6,32,0.65)] via-transparent to-transparent" />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="container flex h-full flex-col justify-end pb-10 pt-16 text-white md:pb-14">
            <div className="pointer-events-auto max-w-2xl">
              <div className="mb-5 inline-flex rounded-2xl bg-white/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                <Image
                  src="/brand/logo-mustafa.png"
                  alt="Mustafá Representações"
                  width={180}
                  height={90}
                  style={{ width: "160px", height: "auto" }}
                  priority
                />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                {slides[active].eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                {slides[active].title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                {slides[active].subtitle}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#industrias" className="btn btn-ghost">
                  Escolher indústria
                </a>
                <Link
                  href="/contato"
                  className="btn border-white/40 bg-transparent text-white hover:bg-white hover:text-[var(--forest-deep)]"
                >
                  Falar com a Mustafá
                </Link>
              </div>
            </div>

            <div className="pointer-events-auto mt-8 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Ir para slide ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === active
                      ? "w-8 bg-[var(--gold)]"
                      : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
