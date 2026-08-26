"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const number = params.get("number");
  const wa = params.get("wa");

  return (
    <div className="container py-16 md:py-24">
      <div className="surface fade-rise max-w-2xl rounded-[var(--radius)] p-8 md:p-12">
        <p className="eyebrow">Pedido recebido</p>
        <h1 className="display mt-4 text-[clamp(2.25rem,5vw,3.25rem)] text-[var(--forest)]">
          Obrigado!
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--ink-soft)]">
          Seu pedido {number ? <strong>{number}</strong> : ""} foi enviado para a
          equipe Mustafá. Em breve entram em contato para confirmar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary">
              Falar no WhatsApp
            </a>
          ) : null}
          <Link href="/catalogo" className="btn btn-secondary">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-16 text-[var(--ink-soft)]">Carregando…</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
