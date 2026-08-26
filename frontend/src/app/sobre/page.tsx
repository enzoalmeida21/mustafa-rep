import { BrandLockup } from "@/components/BrandLockup";

export const metadata = {
  title: "Sobre",
};

export default function AboutPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-center">
          <BrandLockup size="lg" />
        </div>

        <div className="mt-12 text-center">
          <p className="eyebrow">Sobre</p>
          <h1 className="display mt-4 text-[clamp(2.25rem,5.5vw,3.75rem)] text-[var(--forest)]">
            Representação com presença e elegância comercial
          </h1>
        </div>

        <div className="mt-10 space-y-6 text-[1.05rem] leading-relaxed text-[var(--ink-soft)] md:text-lg">
          <p>
            A Mustafá Representações conecta marcas e clientes no Maranhão e no
            Nordeste, com execução em loja, catálogo claro e pedidos simples.
          </p>
          <p>
            Nosso portal foi feito para facilitar a decisão de compra: ver
            produtos, entender preços e enviar o pedido com confiança.
          </p>
        </div>

        <div className="divider-hair my-12" />

        <dl className="grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase">
              Domínio oficial
            </dt>
            <dd className="mt-2 font-semibold text-[var(--forest)]">
              mustafarep.com
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--ink-mute)] uppercase">
              Atendimento
            </dt>
            <dd className="mt-2 text-[var(--ink-soft)]">
              Maranhão e Nordeste — catálogo por indústria e ativação em PDV
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
