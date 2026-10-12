import { PuntosNumerados } from "@/components/ui/PuntosNumerados";
import { compromisos, notaCompromisos } from "@/content/estudio";

/**
 * Banda de lo que el cliente controla. Va en la home, tras «Quién hace esto»,
 * y otra vez en /estudio/. El patrón numerado es el de las ventajas de
 * /herramientas/.
 */
export function Compromisos({ className }: { className?: string }) {
  return (
    <section aria-labelledby="compromisos-titulo" className={className}>
      <div className="border-t border-conducto pt-14">
        <h2
          id="compromisos-titulo"
          className="max-w-2xl text-3xl font-medium text-hueso md:text-5xl"
        >
          Lo que construimos, lo manejas tú.
        </h2>
        <PuntosNumerados puntos={compromisos} className="md:grid-cols-3" />
        <p className="mt-10 max-w-2xl text-sm text-apagado-abajo">{notaCompromisos}</p>
      </div>
    </section>
  );
}
