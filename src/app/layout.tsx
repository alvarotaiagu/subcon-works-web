import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cortina } from "@/components/layout/Cortina";
import { PageTransition } from "@/components/layout/PageTransition";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AvisoCookies } from "@/components/layout/AvisoCookies";
import { Mando } from "@/components/layout/Mando";
import { clasesBoton } from "@/components/ui/Boton";
import { scriptCabeza } from "@/lib/scriptCabeza";

// ─── Letras (spec 002 §3.2) ────────────────────────────────────────────────────
// Autoalojadas en public/fuentes/ y sin next/font (precarga toda la lista). Las url()
// van aquí, con el basePath de Pages delante, y no en globals.css con rutas fijas.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const GEOLOGICA = `${BASE}/fuentes/geologica-oblique.woff2`;
const KODE_MONO = `${BASE}/fuentes/kode-mono-normal.woff2`;

// El bloque /* latin */ de Google. No trae ← → ★ ↕: esos van con <Glifo> (PD-4).
const LATINO =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

/*
  Respaldo mientras llega la letra: una familia por fuente del sistema, con su
  size-adjust y sus métricas, para que el cambio no mueva el titular (CLS, §3.15).
  Por plataforma: Arial (Windows; también viene en macOS e iOS, así que allí suele
  ganar ella), Liberation Sans (Linux), Helvetica Neue (Apple) y Roboto (Android). Si
  local() no encuentra una, el navegador pasa a la siguiente familia de la lista.

  Medido con Playwright (Chromium 1.63, 2026-10-12) a 100 px: ancho de la muestra en la
  letra buena entre su ancho en el respaldo. Arial con local(); Liberation Sans 2.1.5 y
  Roboto Regular con su fichero (lo mismo que local() en Linux y Android).

    Geologica 300 «SHRP» 0, «Lo de arriba vende.» = 899,75 px
      Arial 861,72 · Liberation Sans 861,72 · Roboto 843,61
    Kode Mono 500, «Lo de abajo trabaja.» = 1200,00 px
      Arial 884,05 · Liberation Sans 884,05 · Roboto 874,33

  Helvetica Neue no se puede medir en esta máquina: su ancho sale de la media de
  capsize (xWidthAvg 450/1000 frente a 913/2048 de Arial, +0,94 %). Es una estimación.

  ascent/descent: los de la letra buena (Geologica 1950/−550 sobre 2000, Kode Mono
  980/−300 sobre 1000, line-gap 0) divididos por el size-adjust, porque el navegador
  los escala con él. Comprobado: con estos valores, el ancho difiere menos de 0,15 px y
  la caja de línea, ≤ 1 px por redondeo (a 100 px).
*/
const RESPALDOS = [
  // familia, local(), size-adjust, ascent, descent
  ["Geologica Arial", "Arial", 104.41, 93.38, 26.34],
  ["Geologica Liberation", "Liberation Sans", 104.41, 93.38, 26.34],
  ["Geologica Helvetica", "Helvetica Neue", 103.44, 94.26, 26.59],
  ["Geologica Roboto", "Roboto", 106.65, 91.42, 25.78],
  ["Kode Mono Arial", "Arial", 135.74, 72.2, 22.1],
  ["Kode Mono Liberation", "Liberation Sans", 135.74, 72.2, 22.1],
  ["Kode Mono Helvetica", "Helvetica Neue", 134.47, 72.88, 22.31],
  ["Kode Mono Roboto", "Roboto", 137.25, 71.4, 21.86],
] as const;

const CSS_LETRAS = [
  `@font-face{font-family:"Geologica";font-style:oblique 0deg 12deg;font-weight:100 900;font-display:swap;src:url(${GEOLOGICA}) format("woff2");unicode-range:${LATINO}}`,
  `@font-face{font-family:"Kode Mono";font-style:normal;font-weight:400 700;font-display:swap;src:url(${KODE_MONO}) format("woff2");unicode-range:${LATINO}}`,
  ...RESPALDOS.map(
    ([familia, local, size, asc, desc]) =>
      `@font-face{font-family:"${familia}";src:local("${local}");size-adjust:${size}%;ascent-override:${asc}%;descent-override:${desc}%;line-gap-override:0%}`,
  ),
].join("");

// Interiores: oscuro (§3.1). La portada pone el suyo en su page.tsx (T06).
export const viewport: Viewport = {
  themeColor: "#0E1B1E",
  colorScheme: "dark",
};

// Ninguna web de la casa se indexa mientras no haya nada vendido: meta robots
// noindex en todas las páginas, y robots.ts bloqueando el rastreo entero.
export const metadata: Metadata = {
  metadataBase: new URL("https://alvarotaiagu.github.io/subcon-works-web/"),
  title: `${site.nombre} — Web, tienda online y automatización a medida`,
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
    // El alt describe la imagen: og.png lleva grabado el lema viejo (regenerarla es P-07).
    images: [
      {
        url: "og.png?v=1",
        width: 1200,
        height: 630,
        alt: "Logo de Undertactics: un iceberg con la línea de superficie en lima",
      },
    ],
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
  // <link rel="preload" as="font" crossorigin> de las dos en el <head> (§3.2), con la
  // API de React que recomienda la guía de metadatos de Next 16.
  for (const href of [GEOLOGICA, KODE_MONO]) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  return (
    // suppressHydrationWarning: el script del <head> pone clases en <html> antes de que
    // React hidrate (spec 002 §3.14, PD-8).
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Lo primero del <head>, antes de pintar: js-si, cortina-si y su seguro,
            densidad-sobria (PD-8). */}
        <script dangerouslySetInnerHTML={{ __html: scriptCabeza(BASE) }} />
        <style dangerouslySetInnerHTML={{ __html: CSS_LETRAS }} />
      </head>
      <body>
        <a
          href="#contenido"
          data-ancla-nativa=""
          className={`${clasesBoton()} fixed left-4 top-4 z-[100] -translate-y-24 px-5 py-2 transition-transform focus-visible:translate-y-0`}
        >
          Saltar al contenido
        </a>
        <Cortina />
        <PageTransition />
        <SmoothScroll />
        <AvisoCookies />
        <Mando />
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
