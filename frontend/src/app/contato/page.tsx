import Link from "next/link";

export const metadata = {
  title: "Contato",
};

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const wa = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
        "Olá! Vim pelo site mustafarep.com e gostaria de falar com a Mustafá.",
      )}`
    : null;

  return (
    <div className="container max-w-2xl py-16 md:py-24">
      <p className="eyebrow">Contato</p>
      <h1 className="display mt-4 text-[clamp(2.25rem,5.5vw,3.75rem)] text-[var(--forest)]">
        Fale com a Mustafá
      </h1>
      <p className="mt-5 text-[1.05rem] leading-relaxed text-[var(--ink-soft)] md:text-lg">
        Atendimento comercial no Maranhão e no Nordeste: pedidos e ativação em
        loja para o seu PDV. Para ver o mix por marca, abra a{" "}
        <Link href="/vitrine" className="font-medium text-[var(--forest)] underline-offset-4 hover:underline">
          vitrine por indústria
        </Link>
        .
      </p>

      <dl className="mt-12 grid gap-8 border-y border-[var(--line)] py-10 sm:grid-cols-2">
        <div>
          <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase">
            Região
          </dt>
          <dd className="mt-2 font-medium text-[var(--ink)]">
            Maranhão e Nordeste
          </dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase">
            Pedidos
          </dt>
          <dd className="mt-2 text-[var(--ink-soft)]">
            Pelo catálogo e checkout do portal
          </dd>
        </div>
      </dl>

      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary mt-10"
        >
          Abrir WhatsApp
        </a>
      ) : (
        <p className="mt-10 text-sm text-[var(--ink-mute)]">
          Configure <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> para habilitar o
          atalho do WhatsApp.
        </p>
      )}
    </div>
  );
}
