import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppSharePanel } from "@/components/WhatsAppSharePanel";
import { api } from "@/lib/api";
import { formatBRL, formatProductName, formatSaleUnit, hasListPrice } from "@/lib/format";
import { industryArt } from "@/lib/industry-art";
import { siteUrl } from "@/lib/site";
import type { Industry, Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catálogo por indústria",
  description:
    "Marcas representadas pela Mustafá: escolha a indústria e veja o mix, embalagem e preço por caixa. Atendimento no Maranhão e no Nordeste.",
  openGraph: {
    title: "Mustafá — catálogo por indústria",
    description:
      "Escolha a marca e veja os produtos que a Mustafá vende, com preço por caixa.",
    url: "/vitrine",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mustafá — catálogo por indústria",
    description: "Escolha a marca e veja o mix com preço por caixa.",
  },
};

const PREVIEW_COUNT = 3;

function initials(name: string) {
  return name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function previewProducts(products: Product[]) {
  const withPhoto = products.filter((product) => product.imageUrl);
  const source = withPhoto.length >= PREVIEW_COUNT ? withPhoto : products;
  return source.slice(0, PREVIEW_COUNT);
}

export default async function VitrinePage() {
  let industries: Industry[] = [];
  let products: Product[] = [];
  try {
    [industries, products] = await Promise.all([
      api.getIndustries(),
      api.getProducts(),
    ]);
  } catch {
    industries = [];
    products = [];
  }

  const byIndustry = new Map<string, Product[]>();
  for (const product of products) {
    const list = byIndustry.get(product.industryId) ?? [];
    list.push(product);
    byIndustry.set(product.industryId, list);
  }

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const wa = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
        "Olá! Vi o catálogo por indústria no site e gostaria de falar com a Mustafá.",
      )}`
    : null;

  const shareLinks = industries.map((industry) => ({
    name: industry.name,
    url: siteUrl(`/industria/${industry.slug}`),
  }));

  return (
    <div className="pb-20">
      <section className="container pt-10 pb-6 md:pt-16">
        <p className="eyebrow">Vitrine WhatsApp</p>
        <h1 className="display mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.25rem)] text-[var(--forest)]">
          As marcas da Mustafá, indústria por indústria
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
          Escolha a indústria, veja o mix e o preço por caixa. Depois é só
          montar o pedido ou falar no WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary">
              Falar no WhatsApp
            </a>
          ) : null}
          <Link href="/carrinho" className="btn btn-secondary">
            Ver pedido
          </Link>
        </div>
      </section>

      <section className="container grid gap-8 pt-6 md:pt-10">
        {industries.length === 0 ? (
          <div className="surface rounded-[var(--radius)] px-6 py-14 text-center">
            <p className="text-[var(--ink-soft)]">
              Nenhuma indústria disponível no momento.
            </p>
          </div>
        ) : (
          industries.map((industry) => {
            const items = byIndustry.get(industry.id) ?? [];
            const preview = previewProducts(items);
            const art = industryArt(industry);
            const total = industry._count?.products ?? items.length;

            return (
              <article
                key={industry.id}
                className="surface overflow-hidden rounded-[var(--radius)]"
              >
                <div className="grid md:grid-cols-[minmax(0,0.9fr)_1.2fr]">
                  <Link
                    href={`/industria/${industry.slug}`}
                    className="relative block min-h-[11rem] overflow-hidden border-b border-[var(--line)] md:min-h-full md:border-b-0 md:border-r"
                    style={
                      art.background ? { background: art.background } : undefined
                    }
                  >
                    {art.src ? (
                      <Image
                        src={art.src}
                        alt={`Marca ${industry.name}`}
                        fill
                        sizes="(min-width: 768px) 22rem, 100vw"
                        className={
                          art.isMark ? "object-contain p-10" : "object-cover"
                        }
                      />
                    ) : (
                      <div className="brand-tile h-full min-h-[11rem]">
                        <span className="brand-tile-mark">
                          {initials(industry.name)}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col p-5 md:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="display text-3xl text-[var(--forest)]">
                          {industry.name}
                        </h2>
                        {industry.tagline ? (
                          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
                            {industry.tagline}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase">
                        {total} {total === 1 ? "produto" : "produtos"}
                      </span>
                    </div>

                    {preview.length > 0 ? (
                      <ul className="mt-5 grid gap-3">
                        {preview.map((product) => (
                          <li key={product.id}>
                            <Link
                              href={`/produto/${product.slug}`}
                              className="flex items-center gap-3 rounded-[var(--radius-sm)] transition hover:bg-[rgba(59,19,87,0.035)]"
                            >
                              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)]">
                                {product.imageUrl ? (
                                  <Image
                                    src={product.imageUrl}
                                    alt=""
                                    fill
                                    sizes="56px"
                                    className="object-contain p-1"
                                  />
                                ) : (
                                  <span className="brand-tile h-full">
                                    <span className="brand-tile-mark text-[0.95rem]">
                                      {(product.brand ?? product.name)
                                        .trim()
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </span>
                                  </span>
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-[var(--ink)]">
                                  {formatProductName(product.name)}
                                </span>
                                <span className="mt-0.5 block text-xs text-[var(--ink-mute)]">
                                  {hasListPrice(product.price)
                                    ? `${formatBRL(product.price)} / ${formatSaleUnit(product.unit)}`
                                    : "Sob consulta"}
                                  {product.packLabel ? ` · ${product.packLabel}` : ""}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-5 text-sm text-[var(--ink-soft)]">
                        Mix em atualização neste hall.
                      </p>
                    )}

                    <Link
                      href={`/industria/${industry.slug}`}
                      className="btn btn-primary mt-6 w-fit"
                    >
                      Ver mix {industry.name}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <section className="container">
        <WhatsAppSharePanel
          catalogUrl={siteUrl("/vitrine")}
          industries={shareLinks}
        />
      </section>
    </div>
  );
}
