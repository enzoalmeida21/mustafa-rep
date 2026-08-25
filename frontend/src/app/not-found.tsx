import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24">
      <h1 className="display text-5xl">Página não encontrada</h1>
      <p className="mt-4 text-[var(--ink-soft)]">
        O conteúdo que você procura não está disponível.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Voltar ao início
      </Link>
    </div>
  );
}
