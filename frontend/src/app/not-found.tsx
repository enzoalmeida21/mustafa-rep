import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 md:py-32">
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow">Erro 404</p>
        <h1 className="display mt-4 text-[clamp(2.25rem,5.5vw,3.5rem)] text-[var(--forest)]">
          Página não encontrada
        </h1>
        <p className="mt-5 leading-relaxed text-[var(--ink-soft)]">
          O conteúdo que você procura não está disponível ou foi movido.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Voltar ao início
          </Link>
          <Link href="/catalogo" className="btn btn-secondary">
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
