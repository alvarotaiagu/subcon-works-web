import { Boton } from "@/components/ui/Boton";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaPlantilla } from "@/components/ui/TarjetaPlantilla";
import { Titular } from "@/components/ui/Titular";
import { cifras } from "@/content/cifras";
import { plantillas } from "@/content/plantillas";
import { conDorsal } from "@/lib/dorsales";

const etiquetaRecuento =
  cifras.find((c) => c.etiqueta.startsWith("Plantillas propias"))?.etiqueta ??
  "Plantillas propias publicadas y en línea";

/**
 * «−1 · La plantilla» (spec 002 §3.8, préstamo de la dirección B). Las destacadas son los
 * titulares, con dorsal del 1 al N; las demás, el banquillo, del N+1 en adelante: en
 * ambos casos, el orden de `plantillas.ts`. Todo sale de los datos: el título («Una
 * plantilla de N.»), los dorsales y el recuento. Sin pin ni carrusel: una rejilla y una
 * lista, que se leen igual con JS y sin él.
 */
export function Plantillas() {
  const conDorsales = conDorsal(plantillas);
  const titulares = conDorsales.filter((x) => x.plantilla.destacada);
  const banquillo = conDorsales.filter((x) => !x.plantilla.destacada);

  return (
    <Seccion id="plantillas" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular nivel={2} arriba="Una plantilla" em={`de ${plantillas.length}.`} className="max-w-3xl" />

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="max-w-xl text-apagado-abajo">
            {titulares.length} titulares y {banquillo.length} en el banquillo, todas publicadas y en
            línea. Cada una parte de una idea distinta, no de la misma retícula con otro color. Si
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

        {banquillo.length > 0 && (
          <>
            <h3 className="banquillo-titulo">Banquillo</h3>
            <ol className="banquillo" start={banquillo[0].dorsal}>
              {banquillo.map(({ plantilla, dorsal }) => (
                <li key={plantilla.slug}>
                  <a href={plantilla.demo} target="_blank" rel="noopener" className="banquillo-fila">
                    <span data-dorsal className="banquillo-dorsal" aria-hidden="true">
                      {dorsal}
                    </span>
                    <span className="banquillo-negocio">{plantilla.negocio}</span>
                    <span className="banquillo-detalle">
                      {plantilla.sector} · {plantilla.ciudad}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </>
        )}

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
