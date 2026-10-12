import { Seccion } from "@/components/ui/Seccion";
import { Auditoria } from "./Auditoria";

/**
 * «Fondo · Auditoría» (spec 002 §3.11, plan PD-12): el final del corte. Nace en T06 como
 * cáscara de lo que había en `Auditoria` (PD-7); su aspecto, las cifras, el enlace por
 * correo y el objeto que se completa los hace T13. Debajo va el pie, en roca.
 *
 * `hilo`: en la portada, el botón es donde acaba el conducto (`data-hilo-fin`). En
 * `/sectores/<slug>/` va sin él.
 */
export function Fondo({ hilo = false }: { hilo?: boolean }) {
  return (
    <Seccion id="auditoria" className="border-t border-conducto py-[var(--space-section)]">
      <Auditoria hilo={hilo} />
    </Seccion>
  );
}
