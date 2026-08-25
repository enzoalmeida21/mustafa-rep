import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { api } from "@/lib/api";
import { formatBRL } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await api.getProduct(slug);
    return { title: product.name, description: product.description };
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
            100
        )
      : null;

  return (
    <div className="container grid gap-8 py-6 md:grid-cols-2 md:gap-10 md:py-10">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-white p-6 shadow-sm">
        <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--paper-deep)]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-[var(--radius)] bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
          {product.brand ?? product.industry?.name ?? "Produto"}
        </p>
        {product.industry ? (
          <Link
            href={`/industria/${product.industry.slug}`}
            className="mt-2 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[var(--gold)] hover:underline"
          >
            Hall {product.industry.name}
          </Link>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-[var(--ink)] md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          {product.packLabel ?? product.unit}
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
          {product.description}
        </p>

        <div className="mt-5 grid gap-1 text-sm text-[var(--ink-soft)]">
          {product.sku ? (
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
          ) : null}
          {product.ean ? (
            <p>
              <strong>EAN:</strong> {product.ean}
            </p>
          ) : null}
        </div>

        <div className="mt-6 border-y border-[var(--line)] py-5">
          {product.compareAtPrice ? (
            <p className="text-sm text-[var(--ink-soft)] line-through">
              {formatBRL(product.compareAtPrice)}
            </p>
          ) : null}
          <p className="text-3xl font-extrabold text-[var(--forest)]">
            {formatBRL(product.price)}
            <span className="ml-2 text-sm font-semibold text-[var(--ink-soft)]">
              / {product.unit}
            </span>
          </p>
          {discount ? (
            <p className="mt-2 text-sm font-bold text-[#22a06b]">-{discount}%</p>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <AddToCartButton product={product} />
          <Link href="/carrinho" className="btn btn-secondary">
            Ver pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
