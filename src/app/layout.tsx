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

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

// Web de venta con casos de clientes reales: no debe indexarse ni aparecer
// en buscadores mientras no se decida lo contrario.
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
  },
  icons: {
    icon: "/favicon.ico",
  },
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
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded bg-accent px-4 py-2 text-sm font-medium text-bg-base transition-transform focus-visible:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Preloader />
        <PageTransition />
        <SmoothScroll />
        <Cursor />
        <Grain />
        <ScrollLine />
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
