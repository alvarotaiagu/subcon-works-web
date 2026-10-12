import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Grain } from "@/components/layout/Grain";
import { Preloader } from "@/components/layout/Preloader";
import { PageTransition } from "@/components/layout/PageTransition";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollLine } from "@/components/layout/ScrollLine";
import { AvisoCookies } from "@/components/layout/AvisoCookies";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Interiores: oscuro (§3.1). La portada pone el suyo en su page.tsx (T06).
export const viewport: Viewport = {
  themeColor: "#0E1B1E",
  colorScheme: "dark",
};

// Ninguna web de la casa se indexa mientras no haya nada vendido: meta robots
// noindex en todas las páginas, y robots.ts bloqueando el rastreo entero.
export const metadata: Metadata = {
  metadataBase: new URL("https://alvarotaiagu.github.io/subcon-works-web/"),
  title: `${site.nombre} — ${site.tagline}`,
  description: site.descripcion,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: site.nombre,
    description: site.descripcion,
    type: "website",
    locale: "es_ES",
    // Relativa a metadataBase, así lleva el prefijo de Pages. Se genera con el
    // logo desde marca/ (ver marca/LEEME.md). Al regenerarla, subir `v`: las
    // redes guardan la tarjeta por URL y no verían la nueva.
    images: [{ url: "og.png?v=1", width: 1200, height: 630, alt: `${site.nombre}: ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image" },
  // Sin `icons` a propósito: Next los genera solo a partir de src/app/favicon.ico
  // y apple-icon.png, y ahí sí les pone el basePath (con un icon.svg al lado deja
  // de enlazar el .ico bajo basePath: por eso no hay). Declarándolos a
  // mano como "/favicon.ico" se publicaban sin prefijo y daban 404 en Pages.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${instrumentSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded bg-hueso px-4 py-2 text-sm font-medium text-hondo transition-transform focus-visible:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Preloader />
        <PageTransition />
        <SmoothScroll />
        <Cursor />
        <Grain />
        <ScrollLine />
        <AvisoCookies />
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
