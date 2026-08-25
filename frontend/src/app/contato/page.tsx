export const metadata = {
  title: "Contato",
};

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const wa = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
        "Olá! Vim pelo site mustafarep.com e gostaria de falar com a Mustafá."
      )}`
    : null;

  return (
    <div className="container max-w-3xl py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
        Contato
      </p>
      <h1 className="display mt-3 text-5xl text-[var(--forest)]">
        Fale com a Mustafá
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)]">
        Atendimento comercial, pedidos e ativação em loja para o seu PDV.
      </p>
      <div className="mt-8 grid gap-4 border border-[var(--line)] bg-white/80 p-6">
        <p>
          <strong>Site:</strong> mustafarep.com
        </p>
        <p>
          <strong>Pedidos:</strong> pelo catálogo e checkout do portal
        </p>
        {wa ? (
          <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary w-fit">
            Abrir WhatsApp
          </a>
        ) : (
          <p className="text-sm text-[var(--ink-soft)]">
            Configure NEXT_PUBLIC_WHATSAPP_NUMBER para habilitar o atalho.
          </p>
        )}
      </div>
    </div>
  );
}
