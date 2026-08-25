"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { src: "/hero/expo-03.jpg", alt: "Ativação Mustafá em loja — degustação Pinheirense" },
  { src: "/hero/expo-04.jpg", alt: "Exposição em atacarejo com balcões das marcas" },
  { src: "/hero/expo-05.jpg", alt: "Ponto de venda e interação com clientes" },
  { src: "/hero/expo-07.jpg", alt: "Gondola BLED — chopp de vinho em exposição" },
  { src: "/hero/expo-09.jpg", alt: "Prateleira organizada com mix de conservas" },
  { src: "/hero/expo-06.jpg", alt: "Equipe Mustafá em operação de merchandising" },
];

export function HomeHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--forest-deep)]">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`hero-slide ${index === active ? "is-active" : ""}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,10,42,0.92)] via-[rgba(42,14,64,0.55)] to-[rgba(42,14,64,0.2)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(26,10,42,0.55)] to-transparent" />

      <div className="container relative z-10 flex min-h-[100svh] flex-col justify-end pb-14 pt-28 text-white">
        <div className="fade-up inline-flex bg-white px-5 py-4 shadow-[var(--shadow)]">
          <Image
            src="/brand/logo-mustafa.png"
            alt="Mustafá"
            width={280}
            height={160}
            priority
            className="h-auto w-[160px] sm:w-[200px] md:w-[240px]"
          />
        </div>
        <h1 className="fade-up-delay mt-7 max-w-xl text-2xl font-medium leading-snug sm:text-3xl md:text-4xl">
          Exposição em loja. Pedido de qualquer cidade.
        </h1>
        <p className="fade-up-delay-2 mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
          Catálogo das marcas representadas, preços claros e pedido online para
          o seu PDV.
        </p>
        <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
          <Link href="/catalogo" className="btn btn-ghost">
            Ver catálogo
          </Link>
          <Link
            href="/contato"
            className="btn border-white/55 bg-transparent text-white hover:bg-white hover:text-[var(--forest-deep)]"
          >
            Falar com a Mustafá
          </Link>
        </div>
      </div>
    </section>
  );
}
