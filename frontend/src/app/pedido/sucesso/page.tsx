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
      <div className="fade-up max-w-2xl border border-[var(--line)] bg-white/65 p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
          Pedido recebido
        </p>
        <h1 className="display mt-3 text-5xl">Obrigado!</h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)]">
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
    <Suspense fallback={<div className="container py-16">Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
