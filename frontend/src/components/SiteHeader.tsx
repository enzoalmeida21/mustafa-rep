"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/#industrias", label: "Indústrias" },
  { href: "/catalogo", label: "Catálogo geral" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [pulse, setPulse] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count > prevCount) {
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 420);
      return () => window.clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  if (pathname.startsWith("/admin")) return null;

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const q = String(form.get("q") || "").trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/90 backdrop-blur-xl">
      <div className="container flex flex-wrap items-center gap-4 py-3 md:gap-6 md:py-4">
        <Link href="/" className="relative h-14 w-[150px] shrink-0 sm:h-16 sm:w-[170px]">
          <Image
            src="/brand/logo-mustafa.png"
            alt="Mustafá Representações"
            fill
            className="object-contain object-left"
            sizes="170px"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--ink-soft)] lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname.startsWith(link.href)
                  ? "text-[var(--forest)]"
                  : "hover:text-[var(--forest)]"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={onSearch}
          className="order-3 flex min-w-0 flex-1 basis-full md:order-none md:basis-auto"
        >
          <div className="flex w-full overflow-hidden rounded-full border border-[var(--line)] bg-[var(--paper)]">
            <input
              name="q"
              type="search"
              placeholder="Buscar produtos ou marcas"
              className="min-h-11 w-full bg-transparent px-4 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-[var(--forest)] px-5 text-sm font-bold text-white"
            >
              Buscar
            </button>
          </div>
        </form>

        <Link
          href="/carrinho"
          className={`ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-bold text-[var(--forest-deep)] shadow-[0_8px_20px_rgba(245,166,35,0.25)] ${pulse ? "cart-pulse" : ""}`}
        >
          Pedido
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--forest)] px-2 py-0.5 text-xs text-white">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}
