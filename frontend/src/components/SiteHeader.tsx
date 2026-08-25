"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/#industrias", label: "Indústrias" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [pulse, setPulse] = useState(false);
  const [prevCount, setPrevCount] = useState(count);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (count > prevCount) {
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 420);
      return () => window.clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const q = String(form.get("q") || "").trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-white/80 shadow-[0_8px_30px_rgba(26,10,40,0.05)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/55 backdrop-blur-md"
      }`}
    >
      <div className="container flex flex-wrap items-center gap-4 py-3 md:gap-8 md:py-3.5">
        <Link href="/" className="relative h-12 w-[132px] shrink-0 sm:h-14 sm:w-[148px]">
          <Image
            src="/brand/logo-mustafa.png"
            alt="Mustafá Representações"
            fill
            className="object-contain object-left"
            sizes="148px"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-[0.82rem] font-medium tracking-[0.02em] text-[var(--ink-soft)] lg:flex">
          {links.map((link) => {
            const active =
              link.href !== "/#industrias" && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition ${
                  active ? "text-[var(--forest)]" : "hover:text-[var(--forest)]"
                }`}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-[var(--gold)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={onSearch}
          className="order-3 flex min-w-0 flex-1 basis-full md:order-none md:basis-auto"
        >
          <div className="flex w-full items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/70 transition focus-within:border-[var(--gold)] focus-within:shadow-[0_0_0_3px_rgba(201,162,74,0.14)]">
            <input
              name="q"
              type="search"
              placeholder="Buscar produtos ou marcas"
              className="min-h-10 w-full bg-transparent px-4 text-sm outline-none placeholder:text-[var(--ink-soft)]"
            />
            <button
              type="submit"
              className="px-4 py-2 text-[0.72rem] font-semibold tracking-[0.12em] text-[var(--forest)] uppercase"
            >
              Buscar
            </button>
          </div>
        </form>

        <Link
          href="/carrinho"
          className={`ml-auto inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--forest)] px-4 py-2 text-[0.78rem] font-semibold tracking-[0.08em] text-white uppercase transition hover:bg-[var(--forest-deep)] ${
            pulse ? "cart-pulse" : ""
          }`}
        >
          Pedido
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/15 px-1.5 py-0.5 text-[0.7rem] font-semibold normal-case tracking-normal text-[var(--gold-soft)]">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}
