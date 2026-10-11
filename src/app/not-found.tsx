import type { Metadata } from "next";
import { Boton } from "@/components/ui/Boton";
import { site } from "@/content/site";
import { gearSvgPath, pitchRadius } from "@/lib/engranaje";

export const metadata: Metadata = {
  // Sin `robots` propio: el del layout ya es noindex y, declarándolo aquí,
  // sustituiría al completo (se perderían nocache y googleBot).
  title: `Página no encontrada — ${site.nombre}`,
};

// Rueda de 18 dientes (la mediana del hero) con el diente 3 —arriba a la
// derecha— partido. Mismo perfil de involuta que la escena 3D.
const DIENTES = 18;
const RUEDA = gearSvgPath(DIENTES, 1, pitchRadius(DIENTES, 1) * 0.34, { rotos: [3] });

export default function NotFound() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-max grid items-center gap-12 pb-[var(--space-section)] md:grid-cols-[1fr_auto] md:gap-20">
        <div>
          <p className="font-mono-label mb-4">Error 404</p>
          <h1 className="text-balance text-5xl font-medium text-text-primary md:text-7xl">
            Esta pieza no encaja.
          </h1>
          <p className="mt-8 max-w-md text-lg text-text-muted">
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
        <svg
          viewBox="-11 -11 22 22"
          className="rueda-rota mx-auto w-56 text-accent md:w-80"
          aria-hidden="true"
        >
          <path
            d={RUEDA}
            fill="var(--bg-raised)"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
