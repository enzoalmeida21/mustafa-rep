"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,#fff_100%)]">
      <div className="container grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="relative h-14 w-[150px]">
            <Image
              src="/brand/logo-mustafa.png"
              alt="Mustafá Representações"
              fill
              className="object-contain object-left"
              sizes="150px"
            />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
            Representação comercial com catálogo por indústria, preços claros e
            pedidos simples para clientes de qualquer cidade.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[var(--forest)] uppercase">
            Navegação
          </p>
          <div className="grid gap-2.5 text-[var(--ink-soft)]">
            <Link className="transition hover:text-[var(--forest)]" href="/#industrias">
              Indústrias
            </Link>
            <Link className="transition hover:text-[var(--forest)]" href="/catalogo">
              Catálogo
            </Link>
            <Link className="transition hover:text-[var(--forest)]" href="/sobre">
              Sobre
            </Link>
            <Link className="transition hover:text-[var(--forest)]" href="/contato">
              Contato
            </Link>
            <Link className="transition hover:text-[var(--forest)]" href="/carrinho">
              Meu pedido
            </Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[var(--forest)] uppercase">
            Atendimento
          </p>
          <p className="text-[var(--ink-soft)]">mustafarep.com</p>
          <p className="mt-2 text-[var(--ink-soft)]">Pedidos e ativação em PDV</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] py-4 text-center text-[0.72rem] tracking-[0.12em] text-[var(--ink-soft)] uppercase">
        © {new Date().getFullYear()} Mustafá Representações
      </div>
    </footer>
  );
}
