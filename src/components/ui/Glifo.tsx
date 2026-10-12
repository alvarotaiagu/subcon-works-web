/**
 * Flechas y estrella dibujadas (spec 002 §3.2, plan PD-4). El juego latino de
 * Geologica y Kode Mono no trae ← → ★ ↕, y escritas como texto caerían a la letra
 * del sistema. Van en línea, de 1em, en el color del texto y ocultas al lector
 * de pantalla: el texto de al lado ya dice lo que hace el enlace o el botón.
 */
type NombreGlifo = "izquierda" | "derecha" | "estrella" | "vertical";

// Flechas: trazo de 1,5 sobre 16 (en un texto de 16 px, como el palo de una letra).
const TRAZOS: Record<Exclude<NombreGlifo, "estrella">, string> = {
  izquierda: "M13 8H3M7 4 3 8l4 4",
  derecha: "M3 8h10M9 4l4 4-4 4",
  vertical: "M8 2.5v11M5 5.5l3-3 3 3M5 10.5l3 3 3-3",
};

// Estrella de cinco puntas, rellena (radios 6,6 y 2,7 sobre el centro 8, 8,6).
const ESTRELLA =
  "M8 2 9.59 6.42 14.28 6.56 10.57 9.43 11.88 13.94 8 11.3 4.12 13.94 5.43 9.43 1.72 6.56 6.41 6.42Z";

export function Glifo({ nombre, className }: { nombre: NombreGlifo; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      className={className}
      // Centrado en la altura de la x, como una flecha de la letra.
      style={{ display: "inline-block", verticalAlign: "-0.125em", flexShrink: 0 }}
    >
      {nombre === "estrella" ? (
        <path d={ESTRELLA} fill="currentColor" />
      ) : (
        <path
          d={TRAZOS[nombre]}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
