import type { Viewport } from "next";
import { Hero } from "@/components/sections/Hero";
import { Servicios } from "@/components/sections/Servicios";
import { Plantillas } from "@/components/sections/Plantillas";
import { Proceso } from "@/components/sections/Proceso";
import { QuienDebajo } from "@/components/sections/QuienDebajo";
import { DiagnosticoRapido } from "@/components/sections/DiagnosticoRapido";
import { Fondo } from "@/components/sections/Fondo";
import { AnclaPortada } from "@/components/layout/AnclaPortada";
import { Hilo } from "@/components/layout/Hilo";

// La portada empieza arriba, en claro (spec 002 §3.1): su barra y su esquema son los de
// la cal. Las interiores se quedan con los del layout (oscuro).
export const viewport: Viewport = {
  themeColor: "#F1EEE6",
  colorScheme: "light dark",
};

/**
 * El corte de la portada (spec 002 §3.5, plan PD-7): siete secciones, en orden, de la
 * superficie al fondo. Sus `id`, cotas, nitidez y fondos salen de `cortePortada`
 * (`src/content/portada.ts`). Este fichero se escribe una vez: cada tarea cambia solo
 * el componente de su sección.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <Plantillas />
      <Proceso />
      <QuienDebajo />
      <DiagnosticoRapido />
      <Fondo hilo />
      {/* El conducto principal (§3.10, T14): solo en la portada. */}
      <Hilo />
      <AnclaPortada />
    </>
  );
}
