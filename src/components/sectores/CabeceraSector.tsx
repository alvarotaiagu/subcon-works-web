import { Boton } from "@/components/ui/Boton";
import { CabeceraInterior } from "@/components/ui/CabeceraInterior";
import type { PaginaSector } from "@/content/sectores";

/**
 * Bloque 1 de una página de sector (spec 001 §3.8, con el delta de la 002 §8): el aspecto
 * de las interiores (`CabeceraInterior`), con la cota «−4 · Sectores» primero y, detrás,
 * la etiqueta del sector; después el titular sobre el problema (no sobre nosotros), la
 * entradilla y los dos botones.
 */
export function CabeceraSector({ pagina }: { pagina: PaginaSector }) {
  return (
    <CabeceraInterior
      pagina="sectores"
      etiqueta={pagina.etiqueta}
      arriba={pagina.titular}
      volver={{ href: "/sectores/" }}
      titularClassName="max-w-4xl text-balance"
      className="mb-20 md:mb-28"
    >
      <p className="mt-8 max-w-xl text-lg text-apagado-abajo">{pagina.entradilla}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Boton href="#diagnostico">Haz el diagnóstico</Boton>
        <Boton href="/auditoria/" variante="secundario">
          Auditoría gratis
        </Boton>
      </div>
    </CabeceraInterior>
  );
}
