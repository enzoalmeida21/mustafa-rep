"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * As fotos disponíveis são retrato de 768x1024. Um banner full-bleed as
 * ampliaria acima da resolução nativa, então o hero usa um painel 3:4 que
 * respeita o aspecto original e mantém o texto sobre fundo sólido.
 */
const shots = [
  {
    src: "/hero/expo-09.jpg",
    alt: "Prateleira com o mix de conservas organizado em loja",
  },
  {
    src: "/hero/expo-05.jpg",
    alt: "Exposição em pallet das marcas representadas",
  },
  {
    src: "/hero/expo-08.jpg",
    alt: "Equipe da Mustafá em reposição de gôndola",
  },
];

export function HeroBanner({
  industryCount,
  productCount,
}: {
  industryCount: number;
  productCount: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % shots.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(150,112,31,0.1),transparent_65%)]"
      />

      <div className="container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <p className="eyebrow fade-rise">Representação comercial</p>

          <h1 className="display fade-rise-1 mt-5 text-[clamp(2.5rem,6.2vw,4.25rem)] text-[var(--forest)]">
            O catálogo das marcas,
            <span className="block text-[var(--gold)]">hall por hall.</span>
          </h1>

          <p className="fade-rise-2 mt-6 text-[1.02rem] leading-relaxed text-[var(--ink-soft)] md:text-lg">
            Entre no hall de cada indústria, consulte SKU, EAN, embalagem e preço
            e envie o pedido — atendimento no Maranhão e no Nordeste.
          </p>

          <div className="fade-rise-2 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/vitrine" className="btn btn-primary">
              Escolher indústria
            </Link>
            <Link href="/catalogo" className="btn btn-secondary">
              Ver catálogo completo
            </Link>
          </div>

          <dl className="fade-rise-2 mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--line)] pt-7">
            {[
              { value: String(industryCount), label: "Indústrias" },
              { value: String(productCount), label: "Produtos" },
              { value: "MA", label: "Nordeste" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="display block text-3xl text-[var(--forest)]">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[0.62rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="fade-rise-1">
          <div className="relative mx-auto w-full max-w-[26rem] lg:mr-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius)] bg-[var(--paper-deep)] shadow-[var(--shadow)]">
              {shots.map((shot, index) => (
                <Image
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 640px) 26rem, 100vw"
                  className={`object-cover transition-opacity duration-1000 ease-out ${
                    index === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(26,10,40,0.42)_0%,transparent_45%)]"
              />
              <p className="absolute bottom-5 left-5 right-5 text-[0.68rem] font-semibold tracking-[0.16em] text-white/85 uppercase">
                Exposição em ponto de venda
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5">
              {shots.map((shot, index) => (
                <button
                  key={shot.src}
                  type="button"
                  aria-label={`Ver foto ${index + 1} de ${shots.length}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  className="group inline-flex h-11 items-center px-1.5"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ${
                      index === active
                        ? "w-9 bg-[var(--gold)]"
                        : "w-4 bg-[var(--line-strong)] group-hover:bg-[var(--forest)]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
