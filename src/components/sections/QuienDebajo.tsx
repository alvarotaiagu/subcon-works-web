import { Seccion } from "@/components/ui/Seccion";
import { Equipo } from "./Equipo";
import { Compromisos } from "./Compromisos";

/**
 * «−3 · Quién está debajo» (spec 002 §3.11): las personas y los compromisos en un solo
 * estrato. Nace en T06 como cáscara de lo que había (PD-7); su aspecto lo hace T13.
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
