import Image from "next/image";

/**
 * O PNG original é quadrado com margens brancas largas, o que reduz a marca a
 * poucos pixels em barras horizontais. Aqui o símbolo recortado é combinado com
 * o wordmark em texto, que permanece nítido em qualquer tamanho.
 */
export function BrandLockup({
  size = "md",
  tone = "dark",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  const symbol = {
    sm: { width: 48, height: 25 },
    md: { width: 58, height: 30 },
    lg: { width: 76, height: 39 },
  }[size];

  const name = {
    sm: "text-[0.82rem]",
    md: "text-[0.95rem]",
    lg: "text-[1.15rem]",
  }[size];

  const sub = {
    sm: "text-[0.5rem]",
    md: "text-[0.55rem]",
    lg: "text-[0.62rem]",
  }[size];

  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/brand/logo-mustafa-symbol.png"
        alt=""
        width={symbol.width}
        height={symbol.height}
        priority
        className="shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`${name} font-bold tracking-[0.06em] ${
            tone === "light" ? "text-white" : "text-[var(--forest)]"
          }`}
        >
          MUSTAFÁ
        </span>
        <span
          className={`${sub} mt-1 font-semibold tracking-[0.22em] ${
            tone === "light" ? "text-white/65" : "text-[var(--ink-mute)]"
          }`}
        >
          REPRESENTAÇÕES
        </span>
      </span>
    </span>
  );
}
