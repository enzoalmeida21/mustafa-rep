import Image from "next/image";

export const metadata = {
  title: "Sobre",
};

export default function AboutPage() {
  return (
    <div className="container py-14 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-8 relative h-24 w-[220px]">
          <Image
            src="/brand/logo-mustafa.png"
            alt="Mustafá Representações"
            fill
            className="object-contain"
            sizes="220px"
            priority
          />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
          Sobre
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--forest)] md:text-5xl">
          Representação com presença e elegância comercial
        </h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--ink-soft)]">
          <p>
            A Mustafá Representações conecta marcas e clientes com execução em
            loja, catálogo claro e pedidos simples para quem está em qualquer
            cidade.
          </p>
          <p>
            Nosso portal foi feito para facilitar a decisão de compra: ver
            produtos, entender preços e enviar o pedido com confiança.
          </p>
          <p>
            Domínio oficial: <strong className="text-[var(--forest)]">mustafarep.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
