import type { Punto } from "@/content/estudio";
import { cn } from "@/lib/utils";

interface PuntosNumeradosProps {
  puntos: Punto[];
  /** Columnas y separación de la rejilla (p. ej. `md:grid-cols-3`). */
  className?: string;
  /** Clases extra del párrafo de cada punto. */
  textoClassName?: string;
}

/** Lista numerada 01, 02… con título y texto: Compromisos y «Cómo trabajamos». */
export function PuntosNumerados({ puntos, className, textoClassName }: PuntosNumeradosProps) {
  return (
    <ol className={cn("mt-12 grid gap-x-10 gap-y-12", className)}>
      {puntos.map((p, i) => (
        <li key={p.titulo} className="border-t border-conducto pt-6">
          <span className="font-mono-label text-xs text-superficie" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-xl font-medium text-hueso">{p.titulo}</h3>
          <p className={cn("mt-3 text-apagado-abajo", textoClassName)}>{p.texto}</p>
        </li>
      ))}
    </ol>
  );
}
