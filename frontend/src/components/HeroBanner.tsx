"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/hero/expo-04.jpg",
    title: "Catálogo por indústria.",
    subtitle: "Escolha o hall, consulte o mix e envie o pedido.",
  },
  {
    src: "/hero/expo-03.jpg",
    title: "Presença comercial refinada.",
    subtitle: "Oliveira, Florapack, H2O, Crivialli e mais marcas representadas.",
  },
  {
    src: "/hero/expo-07.jpg",
    title: "Pedido sem fricção.",
    subtitle: "SKU, EAN, embalagem e preço em uma experiência limpa.",
  },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--forest-deep)]">
      <div className="relative h-[78vw] max-h-[640px] min-h-[460px] w-full md:h-[88vh] md:max-h-[720px] md:min-h-[560px]">
        <div
          className="banner-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.src} className="banner-slide">
              <Image
                src={slide.src}
                alt=""
                fill
                priority={index === 0}
                className="object-cover scale-[1.02]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(16,5,26,0.88)_0%,rgba(26,10,40,0.55)_48%,rgba(26,10,40,0.18)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,5,26,0.55)_0%,transparent_42%)]" />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="container flex h-full flex-col justify-end pb-12 pt-20 text-white md:pb-16">
            <div className="pointer-events-auto max-w-2xl">
              <p className="eyebrow fade-rise text-[var(--gold-soft)]">
                Mustafá Representações
              </p>
              <h1
                key={slides[active].title}
                className="display fade-rise mt-4 text-[clamp(2.8rem,7vw,5.4rem)] text-white"
              >
                {slides[active].title}
              </h1>
              <p className="fade-rise-delay mt-5 max-w-lg text-[0.98rem] leading-relaxed text-white/78 md:text-lg">
                {slides[active].subtitle}
              </p>
              <div className="fade-rise-delay mt-8 flex flex-wrap gap-3">
                <a href="#industrias" className="btn btn-gold">
                  Escolher indústria
                </a>
                <Link href="/contato" className="btn btn-ghost">
                  Falar com a Mustafá
                </Link>
              </div>
            </div>

            <div className="pointer-events-auto mt-10 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Ir para slide ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={`h-px rounded-full transition-all duration-500 ${
                    index === active
                      ? "w-10 bg-[var(--gold)]"
                      : "w-5 bg-white/35 hover:bg-white/70"
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
