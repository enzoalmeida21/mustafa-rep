"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useCart } from "@/lib/cart";
import { BrandLockup } from "./BrandLockup";

const links = [
  { href: "/#industrias", label: "Indústrias" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(count);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  /**
   * O menu é fechado sempre que a rota muda, inclusive por voltar/avançar do
   * navegador. Guardar a rota junto do estado evita um efeito só para resetar.
   */
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (open: boolean) => setMenu({ open, path: pathname });

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 420);
      prevCount.current = count;
      return () => window.clearTimeout(timer);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu((current) => ({ ...current, open: false }));
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return null;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("q") ?? "",
    ).trim();
    setMenuOpen(false);
    router.push(value ? `/catalogo?q=${encodeURIComponent(value)}` : "/catalogo");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[rgba(250,248,251,0.88)] shadow-[0_6px_24px_rgba(26,10,40,0.06)] backdrop-blur-xl"
          : "border-b border-[var(--line)] bg-[rgba(250,248,251,0.72)] backdrop-blur-md"
      }`}
    >
      <div className="container flex h-16 items-center gap-4 md:h-[4.5rem] md:gap-6">
        <Link
          href="/"
          aria-label="Mustafá Representações — página inicial"
          className="shrink-0"
        >
          <span className="md:hidden">
            <BrandLockup size="sm" />
          </span>
          <span className="hidden md:block">
            <BrandLockup size="md" />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex h-10 items-center rounded-full px-3 text-[0.84rem] font-medium transition ${
                  active
                    ? "text-[var(--forest)]"
                    : "text-[var(--ink-soft)] hover:bg-white/70 hover:text-[var(--forest)]"
                }`}
              >
                {link.label}
                {active ? (
                  <span className="absolute inset-x-3 bottom-1.5 h-px bg-[var(--gold)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={submitSearch}
          role="search"
          className="ml-auto hidden min-w-0 max-w-sm flex-1 md:flex"
        >
          <div className="flex w-full items-center rounded-full border border-[var(--line-strong)] bg-white/80 transition focus-within:border-[var(--gold)] focus-within:shadow-[0_0_0_3px_rgba(150,112,31,0.13)]">
            <input
              name="q"
              type="search"
              aria-label="Buscar produtos ou marcas"
              placeholder="Buscar produtos ou marcas"
              className="h-10 w-full min-w-0 bg-transparent px-4 text-sm outline-none placeholder:text-[var(--ink-mute)]"
            />
            <button
              type="submit"
              className="mr-1 inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--forest)] uppercase transition hover:bg-[var(--paper-deep)]"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <Link
            href="/carrinho"
            aria-label={`Meu pedido, ${count} ${count === 1 ? "caixa" : "caixas"}`}
            className={`inline-flex h-10 items-center gap-2 rounded-full bg-[var(--forest)] px-3.5 text-[0.74rem] font-semibold tracking-[0.08em] text-white uppercase transition hover:bg-[var(--forest-deep)] md:px-4 ${
              pulse ? "cart-pulse" : ""
            }`}
          >
            <span className="hidden sm:inline">Pedido</span>
            <span className="sm:hidden" aria-hidden>
              Ped.
            </span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/18 px-1.5 text-[0.7rem] font-bold tracking-normal text-[var(--gold-soft)]">
              {count}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] bg-white/80 text-[var(--forest)] transition hover:bg-white lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300 ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-[1.5px] w-4 bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300 ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-16 z-40 cursor-default bg-[rgba(26,10,40,0.32)] backdrop-blur-[2px] lg:hidden"
          />
          <div
            id="menu-mobile"
            className="relative z-50 border-t border-[var(--line)] bg-[rgba(250,248,251,0.98)] backdrop-blur-xl lg:hidden"
          >
            <div className="container grid gap-1 py-4">
              <form onSubmit={submitSearch} role="search" className="mb-2 md:hidden">
                <div className="flex w-full items-center rounded-full border border-[var(--line-strong)] bg-white transition focus-within:border-[var(--gold)]">
                  <input
                    name="q"
                    type="search"
                    aria-label="Buscar produtos ou marcas"
                    placeholder="Buscar produtos ou marcas"
                    className="h-11 w-full min-w-0 bg-transparent px-4 text-sm outline-none placeholder:text-[var(--ink-mute)]"
                  />
                  <button
                    type="submit"
                    className="mr-1 inline-flex h-9 shrink-0 items-center rounded-full px-3 text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--forest)] uppercase"
                  >
                    Buscar
                  </button>
                </div>
              </form>

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex h-12 items-center justify-between rounded-[var(--radius-sm)] px-3 text-[0.95rem] font-medium transition ${
                    isActive(pathname, link.href)
                      ? "bg-white text-[var(--forest)]"
                      : "text-[var(--ink)] hover:bg-white/80"
                  }`}
                >
                  {link.label}
                  <span aria-hidden className="text-[var(--ink-mute)]">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
