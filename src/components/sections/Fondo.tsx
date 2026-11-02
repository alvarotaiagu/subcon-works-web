import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { cifras } from "@/content/cifras";
import { loQueRecibes, loQueNoPedimos, TOTAL_PREGUNTAS } from "@/content/auditoria";
import { FondoObjeto } from "./FondoObjeto";

// «36» (spec 002 §3.5): la cifra de la auditoría de `cifras.ts`, buscada por lo que es (no por
// su posición). «0 €» salió en la 003 (A34, A80: el precio se dice «no se cobra»).
const preguntas = cifras.find((c) => c.etiqueta.startsWith("Preguntas de la auditoría"));
if (!preguntas) throw new Error("Fondo: falta la cifra de la auditoría en cifras.ts");
const cifrasFondo = [preguntas];

/**
 * «Fondo · Auditoría» (spec 002 §3.11, plan PD-12): el final del corte y del objeto. La
 * oferta, lo que lleva el informe, lo que no se pide, la cifra de la auditoría y el
 * objeto que se completa (`FondoObjeto`). Debajo va el pie, en roca.
 *
 * `hilo`: en la portada, el botón es donde acaba el conducto (`data-hilo-fin`). En
 * `/sectores/<slug>/` va sin él. El formulario de 36 preguntas sigue en `/auditoria/`.
 */
export function Fondo({ hilo = false }: { hilo?: boolean }) {
  return (
    <Seccion id="auditoria" aria-labelledby="fondo-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
          {/* Columna izquierda: la oferta. Se queda fija mientras pasa la lista de la
              derecha, que es más alta. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Titular
              nivel={2}
              id="fondo-titulo"
              arriba="Antes de hablar de precio, miramos cómo trabajáis."
            />
            <p className="mt-8 max-w-md text-lg text-apagado-abajo">
              Contestas {TOTAL_PREGUNTAS} preguntas sobre cómo trabajáis, con tus palabras, y te
              mandamos por correo un informe de tu negocio.
            </p>
            <p className="mt-4 max-w-md text-apagado-abajo">
              La auditoría no se cobra, y no te pedimos acceso a ninguno de tus programas.
            </p>
          </div>

          {/* Columna derecha: qué lleva dentro el informe, y qué no se pide nunca. */}
          <div>
            <ol className="space-y-px">
              {loQueRecibes.map((item, i) => (
                <li key={item.titulo} className="border-t border-conducto py-8 last:border-b">
                  <div className="flex gap-6">
                    <span className="font-mono-label w-8 shrink-0 pt-1 text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-xl font-medium text-hueso md:text-2xl">{item.titulo}</p>
                      <p className="mt-2 max-w-md text-apagado-abajo">{item.texto}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded-2xl border border-conducto bg-estrato p-7">
              <p className="font-mono-label mb-4 text-[10px]">Lo que no te vamos a pedir</p>
              <ul className="space-y-2.5">
                {loQueNoPedimos.map((linea) => (
                  <li key={linea} className="flex gap-3 text-sm text-apagado-abajo">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-superficie" />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-apagado-abajo">
                La auditoría se hace sobre cómo trabajáis, sin entrar en vuestros programas. Si aun
                así nos llega algo de eso, lo borramos y te avisamos.
              </p>
            </div>
          </div>
        </div>

        {/* El final: la cifra y el objeto (donde acaba el conducto). Debajo, el pie. */}
        <div className="mt-20 grid gap-12 border-t border-conducto pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
          <ul className="fondo-cifras">
            {cifrasFondo.map((c) => (
              <li key={c.etiqueta}>
                <p className="fondo-cifra-valor">
                  <span className="whitespace-nowrap">
                    {c.valor}
                    {c.sufijo}
                  </span>
                </p>
                <p className="fondo-cifra-etiqueta">{c.etiqueta}</p>
              </li>
            ))}
          </ul>
          <div className="self-center">
            <FondoObjeto hilo={hilo} />
          </div>
        </div>
      </div>
    </Seccion>
  );
}
