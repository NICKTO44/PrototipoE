import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { ContactDock } from "@/components/layout/ContactDock";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import { QuoteAgentProvider, QuoteAgentWidget } from "@/features/quote-agent";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Controladores para colada caliente | Euroheaters México",
    template: "%s | Euroheaters México",
  },
  description:
    "Controladores de temperatura, tiempo de inyección y presión para moldes de colada caliente. Ficha técnica, configurador y cotización.",
};

export const viewport: Viewport = {
  themeColor: "#101417",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${barlow.variable} ${barlowCondensed.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-paper focus:px-4 focus:py-2"
        >
          Saltar al contenido
        </a>
        <QuoteAgentProvider>
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
          <ContactDock />
          <QuoteAgentWidget />
        </QuoteAgentProvider>
      </body>
    </html>
  );
}
