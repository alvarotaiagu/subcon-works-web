import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * Símbolo de Undertactics: la punta del iceberg encima de la superficie (línea
 * lima) y el bloque grande debajo, que es lo que mira la auditoría.
 * Misma geometría que `SIMBOLO` en scripts/marca/logo_svg.py, de donde salen los
 * ficheros de marca/, el favicon y og.png: si cambia aquí, cambiarla allí y
 * regenerar (marca/LEEME.md).
 */
export function Simbolo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <path d="M14 21.5 23 7.5l11 14z" className="fill-hueso" />
      <path d="M4 21.5h40" fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-superficie" />
      <path
        d="M10 25.5h28l5.5 8.5-9 10.5H17L5.5 33z"
        fillOpacity="0.16"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="fill-bloque stroke-bloque"
      />
    </svg>
  );
}

/**
 * Logo completo: símbolo + «under» fino y apagado + «tactics» en negrita.
 * El tamaño sale del `font-size` de quien lo usa (clases `text-*`).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("font-display inline-flex items-center gap-[0.35em] leading-none whitespace-nowrap", className)}
      role="img"
      aria-label={site.nombre}
    >
      <Simbolo className="h-[1.3em] w-[1.3em] shrink-0" />
      <span className="tracking-[-0.035em] text-hueso" aria-hidden="true">
        <span className="font-normal text-bloque">under</span>
        <span className="font-bold">tactics</span>
      </span>
    </span>
  );
}
