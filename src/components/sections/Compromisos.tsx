import { PuntosNumerados } from "@/components/ui/PuntosNumerados";
import { Titular } from "@/components/ui/Titular";
import { compromisos, notaCompromisos } from "@/content/estudio";

/**
 * Banda de lo que el cliente controla. Va en la portada, dentro de «−3 · Quién está
 * debajo» (`QuienDebajo`), y otra vez en /estudio/. El patrón numerado es el de las ventajas de
 * /herramientas/.
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
        <PuntosNumerados puntos={compromisos} className="md:grid-cols-3" />
        <p className="mt-10 max-w-2xl text-sm text-apagado-abajo">{notaCompromisos}</p>
      </div>
    </section>
  );
}
