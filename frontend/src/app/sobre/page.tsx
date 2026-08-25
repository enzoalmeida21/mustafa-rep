import Image from "next/image";

export const metadata = {
  title: "Sobre",
};

export default function AboutPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative mx-auto mb-10 h-20 w-[190px]">
          <Image
            src="/brand/logo-mustafa.png"
            alt="Mustafá Representações"
            fill
            className="object-contain"
            sizes="190px"
            priority
          />
        </div>
        <p className="eyebrow">Sobre</p>
        <h1 className="display mt-4 text-5xl text-[var(--forest)] md:text-6xl">
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
            Domínio oficial:{" "}
            <strong className="font-semibold text-[var(--forest)]">
              mustafarep.com
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
