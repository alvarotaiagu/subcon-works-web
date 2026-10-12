import type { Metadata } from "next";
import { Boton } from "@/components/ui/Boton";
import { CabeceraInterior, nitidezInterior } from "@/components/ui/CabeceraInterior";
import { Simbolo } from "@/components/ui/Logo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  // Sin `robots` propio: el del layout ya es noindex y, declarándolo aquí,
  // sustituiría al completo (se perderían nocache y googleBot).
  title: `Página no encontrada — ${site.nombre}`,
};

/**
 * La 404 (spec 002 §3.12): «no hay nada a esta cota». El iceberg se pinta sin la línea de
 * superficie y la cota es «Sin fondo · 404». Como las demás interiores: empieza «debajo»,
 * sin cortina.
 */
export default function NotFound() {
  return (
    <div style={nitidezInterior("error404")}>
      <CabeceraInterior
        pagina="error404"
        arriba="No hay nada"
        em="a esta cota."
        className="pb-[var(--space-section)]"
      >
        <div className="mt-8 grid items-start gap-12 md:grid-cols-[1fr_auto] md:gap-20">
          <div>
            <p className="max-w-md text-lg text-apagado-abajo">
              La página que buscas no existe o ha cambiado de sitio. Vuelve al principio o mira las
              plantillas.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Boton href="/">Ir al inicio</Boton>
              <Boton href="/plantillas/" variante="secundario">
                Ver plantillas
              </Boton>
            </div>
          </div>
          <Simbolo superficie={false} className="mx-auto w-40 md:w-64" />
        </div>
      </CabeceraInterior>
    </div>
  );
}
