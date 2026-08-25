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
      <h1 className="display mt-4 text-5xl text-[var(--forest)] md:text-6xl">
        Fale com a Mustafá
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--ink-soft)]">
        Atendimento comercial, pedidos e ativação em loja para o seu PDV.
      </p>
      <div className="mt-10 space-y-4 border-y border-[var(--line)] py-8 text-[var(--ink)]">
        <p>
          <span className="text-[0.72rem] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
            Site
          </span>
          <br />
          mustafarep.com
        </p>
        <p>
          <span className="text-[0.72rem] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
            Pedidos
          </span>
          <br />
          pelo catálogo e checkout do portal
        </p>
      </div>
      {wa ? (
        <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary mt-8">
          Abrir WhatsApp
        </a>
      ) : (
        <p className="mt-8 text-sm text-[var(--ink-soft)]">
          Configure NEXT_PUBLIC_WHATSAPP_NUMBER para habilitar o atalho.
        </p>
      )}
    </div>
  );
}
