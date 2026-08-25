import type { Metadata } from "next";
import { Montserrat, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Mustafá | Portal de Pedidos",
    template: "%s | Mustafá",
  },
  description:
    "Catálogo e pedidos da Mustafá Representadas. Veja produtos, preços e envie seu pedido online.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mustafarep.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${montserrat.variable} h-full`}>
      <body className="relative z-10 flex min-h-full flex-col antialiased">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
