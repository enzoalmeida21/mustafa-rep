"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLockup } from "./BrandLockup";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,#fff_100%)]">
      <div className="container grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <BrandLockup size="lg" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
            Representação comercial no Maranhão e no Nordeste: catálogo por
            indústria, preços claros e pedidos simples.
          </p>
        </div>
        <nav className="text-sm" aria-label="Navegação do rodapé">
          <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--forest)] uppercase">
            Navegação
          </p>
          <ul className="-mx-2 grid text-[var(--ink-soft)]">
            {[
              { href: "/#industrias", label: "Indústrias" },
              { href: "/catalogo", label: "Catálogo" },
              { href: "/sobre", label: "Sobre" },
              { href: "/contato", label: "Contato" },
              { href: "/carrinho", label: "Meu pedido" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-9 items-center rounded-[var(--radius-sm)] px-2 transition hover:text-[var(--forest)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--forest)] uppercase">
            Atendimento
          </p>
          <ul className="-mx-2 grid text-[var(--ink-soft)]">
            <li>
              <a
                href="https://mustafarep.com"
                className="inline-flex h-9 items-center rounded-[var(--radius-sm)] px-2 transition hover:text-[var(--forest)]"
              >
                mustafarep.com
              </a>
            </li>
            <li className="px-2 pt-1.5 leading-relaxed text-[var(--ink-mute)]">
              Maranhão e Nordeste
            </li>
            <li className="px-2 pt-1 leading-relaxed text-[var(--ink-mute)]">
              Pedidos e ativação em ponto de venda
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--line)] py-4 text-center text-[0.72rem] tracking-[0.12em] text-[var(--ink-soft)] uppercase">
        © {new Date().getFullYear()} Mustafá Representações
      </div>
    </footer>
  );
}
