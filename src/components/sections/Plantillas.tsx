import { PideTuSector } from "@/components/plantillas/PideTuSector";
import { Boton } from "@/components/ui/Boton";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaPlantilla } from "@/components/ui/TarjetaPlantilla";
import { Titular } from "@/components/ui/Titular";
import { cifras, palabraSemanas, plazo } from "@/content/cifras";
import { plantillas, sectoresPlantillas } from "@/content/plantillas";
import { conDorsal } from "@/lib/dorsales";

const etiquetaRecuento =
  cifras.find((c) => c.etiqueta.startsWith("Plantillas propias"))?.etiqueta ??
  "Plantillas propias publicadas y en línea";

/**
 * «−1 · La plantilla» (spec 002 §3.8, préstamo de la dirección B). Solo las destacadas,
 * con dorsal del 1 al N en el orden de `plantillas.ts`; las demás viven en `/plantillas/`.
 * Debajo, «¿Tu sector no está?» con el correo para pedir la suya (D-026). Todo sale de
 * los datos: el título («Una plantilla de N.»), los dorsales y el recuento. Sin pin ni
 * carrusel: una rejilla, que se lee igual con JS y sin él.
 */
export function Plantillas() {
  const conDorsales = conDorsal(plantillas);
  const titulares = conDorsales.filter((x) => x.plantilla.destacada);

  return (
    <Seccion id="plantillas" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular nivel={2} arriba="Una plantilla" em={`de ${plantillas.length}.`} className="max-w-3xl" />

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="max-w-xl text-apagado-abajo">
            {titulares.length} de las {plantillas.length} que tenemos publicadas y en línea; las demás,
            en el catálogo. Cada una parte de una idea distinta, no de la misma retícula con otro color. Si
            una encaja con lo tuyo, se adapta con tus datos y está en línea en dos semanas.
          </p>
          <div className="border-l-2 border-superficie pl-5">
            <p className="font-mono-label mb-2 text-xs text-superficie">Aviso</p>
            <p className="text-sm text-apagado-abajo">
              Todos los negocios que aparecen son{" "}
              <strong className="font-medium text-hueso">inventados</strong>: nombres, direcciones,
              precios y textos. No son clientes ni existen. Están para enseñar cómo queda una web
              terminada, con contenido de verdad en vez de «Lorem ipsum».
            </p>
          </div>
        </div>

        {titulares.length > 0 && (
          <ol className="lista-titulares mt-14">
            {titulares.map(({ plantilla, dorsal }) => (
              <li key={plantilla.slug}>
                <TarjetaPlantilla plantilla={plantilla} variante="corte" dorsal={dorsal} />
              </li>
            ))}
          </ol>
        )}

        <PideTuSector vistas={titulares.length} />

        {/* Solo en la densidad sobria (§3.16): el dato que sustituye a los dorsales y a los
            pozos de las tarjetas. Todo sale de los datos. */}
        <p className="sobria-recuento">
          <span>
            <b>{sectoresPlantillas.length}</b> sectores
          </span>
          <span aria-hidden="true"> · </span>
          <span>
            <b>{plantillas.length}</b> bases
          </span>
          {plazo && (
            <>
              <span aria-hidden="true"> · </span>
              <span>
                <b>{plazo.valor}</b> {palabraSemanas(plazo.valor)}
              </span>
            </>
          )}
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-t border-conducto pt-8">
          <p className="flex items-baseline gap-4">
            <span className="font-mono-label text-5xl font-medium leading-none text-hueso normal-case tracking-normal">
              {plantillas.length}
            </span>
            <span className="max-w-[16rem] text-apagado-abajo">{etiquetaRecuento}</span>
          </p>
          <Boton href="/plantillas/">Ver el catálogo entero</Boton>
        </div>
      </div>
    </Seccion>
  );
}
