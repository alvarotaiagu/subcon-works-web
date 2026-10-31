import type { Viewport } from "next";
import { Hero } from "@/components/sections/Hero";
import { Problemas } from "@/components/consultora/Problemas";
import { Servicios } from "@/components/sections/Servicios";
import { Soluciones } from "@/components/consultora/Soluciones";
import { Proceso } from "@/components/sections/Proceso";
import { Proyectos } from "@/components/consultora/Proyectos";
import { QuienEstudio } from "@/components/consultora/QuienEstudio";
import { Faq } from "@/components/consultora/Faq";
import { Contacto } from "@/components/consultora/Contacto";
import { AnclaPortada } from "@/components/layout/AnclaPortada";
import { Hilo } from "@/components/layout/Hilo";
import { servicios } from "@/content/consultora";

// La portada empieza arriba, en claro (spec 002 §3.1): su barra y su esquema son los de
// la cal. Las interiores se quedan con los del layout (oscuro).
export const viewport: Viewport = {
  themeColor: "#F1EEE6",
  colorScheme: "light dark",
};

/**
 * Versión «consultora tecnológica» de la portada (rama `exp/consultora`, experimento para
 * comparar con la vigente). Nueve secciones, de la superficie al fondo; sus `id`, cotas,
 * nitidez y fondos salen de `cortePortada` (`src/content/portada.ts`) y los textos de
 * `src/content/consultora.ts`. De la portada anterior se quedan los pozos de Servicios
 * (con las cuatro líneas), el Proceso con su testigo y los compromisos en «Quién».
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Problemas />
      <Servicios
        contenido={{ arriba: servicios.titulo, em: servicios.em, intro: servicios.intro, pozos: servicios.lineas }}
      />
      <Soluciones />
      <Proceso />
      <Proyectos />
      <QuienEstudio />
      <Faq />
      <Contacto />
      {/* El conducto principal (§3.10, T14): solo en la portada. */}
      <Hilo />
      <AnclaPortada />
    </>
  );
}
