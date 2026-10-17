import { Seccion } from "@/components/ui/Seccion";
import { Equipo } from "./Equipo";
import { Compromisos } from "./Compromisos";

/**
 * «−3 · Quién está debajo» (spec 002 §3.11): las personas y los compromisos en un solo
 * estrato. Las personas van con la tarjeta de siempre; los compromisos, como paradas de un pozo (T13).
 * El `id` es `equipo`: lo enlaza «/#equipo» desde /estudio/.
 */
export function QuienDebajo() {
  return (
    <Seccion id="equipo" className="py-[var(--space-section)]">
      <Equipo />
      <Compromisos className="container-max mt-[var(--space-section)]" />
    </Seccion>
  );
}
