import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { api } from "@/lib/api";
import { formatBRL, formatProductName, hasListPrice } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await api.getProduct(slug);
    return {
      title: formatProductName(product.name),
      description: product.description,
    };
  } catch {
    return { title: "Produto" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await api.getProduct(slug);
  } catch {
    notFound();
  }

  const discount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price)
      ? Math.round(
          ((Number(product.compareAtPrice) - Number(product.price)) /
            Number(product.compareAtPrice)) *
            100,
        )
      : null;

  return (
    <div className="container grid gap-10 py-10 md:grid-cols-2 md:gap-14 md:py-16">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={formatProductName(product.name)}
            fill
            className="object-contain p-8"
            sizes="(min-width: 768px) 34rem, 100vw"
            priority
          />
        ) : (
          <div className="brand-tile">
            <span className="brand-tile-mark text-[clamp(3rem,10vw,4.5rem)]">
              {(product.brand ?? product.name).trim().slice(0, 2).toUpperCase()}
            </span>
            <span className="brand-tile-label">
              {product.brand ?? product.industry?.name ?? "Mustafá"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-soft)] uppercase">
          {product.brand ?? product.industry?.name ?? "Produto"}
        </p>
        {product.industry ? (
          <Link
            href={`/industria/${product.industry.slug}`}
            className="mt-1 inline-flex h-8 w-fit items-center text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--gold)] uppercase transition hover:text-[var(--forest)]"
          >
            Hall {product.industry.name} →
          </Link>
        ) : null}
        <h1 className="display mt-3 text-[clamp(2rem,4.5vw,3rem)] text-[var(--ink)]">
          {formatProductName(product.name)}
        </h1>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          {product.packLabel ?? product.unit}
        </p>
        <p className="mt-5 text-base leading-relaxed text-[var(--ink-soft)]">
          {product.description}
        </p>

        <div className="mt-6 grid gap-1 font-mono text-[0.8rem] text-[var(--ink-soft)]">
          {product.sku ? <p>SKU {product.sku}</p> : null}
          {product.ean ? <p>EAN {product.ean}</p> : null}
        </div>

        <div className="mt-8 border-y border-[var(--line)] py-6">
          {hasListPrice(product.price) ? (
            <>
              {product.compareAtPrice && hasListPrice(product.compareAtPrice) ? (
                <p className="text-sm text-[var(--ink-mute)] line-through">
                  {formatBRL(product.compareAtPrice)}
                </p>
              ) : null}
              <p className="text-3xl font-semibold tracking-tight text-[var(--forest)]">
                {formatBRL(product.price)}
                <span className="ml-2 text-sm font-medium text-[var(--ink-mute)]">
                  / {product.unit}
                </span>
              </p>
              {discount ? (
                <p className="mt-2 text-sm font-medium text-[#0f6b45]">
                  −{discount}%
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-xl font-semibold tracking-[0.04em] text-[var(--gold)] uppercase">
                Sob consulta
              </p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Adicione ao pedido e a Mustafá retorna com o preço.
              </p>
            </>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <AddToCartButton product={product} />
          <Link href="/carrinho" className="btn btn-secondary">
            Ver pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
