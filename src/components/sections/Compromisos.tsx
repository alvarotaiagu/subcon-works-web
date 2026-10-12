import { Titular } from "@/components/ui/Titular";
import { compromisos, notaCompromisos } from "@/content/estudio";

/**
 * Los compromisos (lo que el cliente controla), como paradas de un pozo (spec 002 §3.11):
 * una línea vertical en `--conducto` y, en cada parada, un rombo en lima (el mismo de las
 * paradas del hero), el número y el título en Kode Mono. Va en la portada, dentro de
 * «−3 · Quién está debajo» (`QuienDebajo`), y otra vez en /estudio/ (por eso acepta
 * `className`). El estilo vive en `estilos/portada.css` (`.pozo-*`).
 */
export function Compromisos({ className }: { className?: string }) {
  return (
    <section aria-labelledby="compromisos-titulo" className={className}>
      <div className="border-t border-conducto pt-14">
        <Titular
          nivel={2}
          id="compromisos-titulo"
          arriba="Lo que construimos, lo manejas tú."
          className="max-w-2xl"
        />
        <ol className="pozo">
          {compromisos.map((c, i) => (
            <li key={c.titulo} className="pozo-parada">
              <span className="pozo-numero" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="pozo-titulo">{c.titulo}</h3>
              <p className="pozo-texto">{c.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-2xl text-sm text-apagado-abajo">{notaCompromisos}</p>
      </div>
    </section>
  );
}
