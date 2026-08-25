"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="relative h-16 w-[170px]">
            <Image
              src="/brand/logo-mustafa.png"
              alt="Mustafá Representações"
              fill
              className="object-contain object-left"
              sizes="170px"
            />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
            Mustafá Representações — catálogo, pedidos e presença em loja para
            clientes de qualquer cidade.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-bold text-[var(--forest)]">Navegação</p>
          <div className="grid gap-2 text-[var(--ink-soft)]">
            <Link href="/#industrias">Indústrias</Link>
            <Link href="/catalogo">Catálogo geral</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/carrinho">Meu pedido</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-bold text-[var(--forest)]">Atendimento</p>
          <p className="text-[var(--ink-soft)]">mustafarep.com</p>
          <p className="mt-2 text-[var(--ink-soft)]">Pedidos e exposições em PDV</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] bg-[var(--forest-deep)] py-3.5 text-center text-xs tracking-wide text-white/75">
        © {new Date().getFullYear()} Mustafá Representações
      </div>
    </footer>
  );
}
