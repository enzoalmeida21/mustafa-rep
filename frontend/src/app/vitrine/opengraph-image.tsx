import { ImageResponse } from "next/og";

export const alt = "Mustafá Representações — catálogo por indústria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #1a0a28 0%, #3b1357 55%, #241530 100%)",
          color: "#faf8fb",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e6cd93",
          }}
        >
          Mustafá Representações
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 600,
            }}
          >
            Catálogo por indústria
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(250,248,251,0.72)",
              maxWidth: 820,
            }}
          >
            Escolha a marca e veja o mix, embalagem e preço por caixa.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#e6cd93",
          }}
        >
          Maranhão e Nordeste
        </div>
      </div>
    ),
    size,
  );
}
