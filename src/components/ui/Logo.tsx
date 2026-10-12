import type { CSSProperties } from "react";
import { LOGO_GRUPO, LOGO_VIEWBOX, TRAZADO_TACTICS, TRAZADO_UNDER } from "./logo-trazados";

/**
 * Tono del logo (spec 002 §3.3):
 * - "oscuro": para ir sobre `--hondo` o `--roca`.
 * - "claro": para ir sobre `--cal`. La línea es `#5F7D00`, la única excepción a la
 *   regla 1 del §3.1 (lima nunca sobre claro).
 *
 * Los rellenos van por `--logo-texto`, `--logo-apagado` y `--logo-linea`, puestos en
 * línea según el tono. Quien lo use puede pisarlas con su propio `style`
 * (el cambio de la cabecera cambia la prop, no pinta dos logos).
 */
export type TonoLogo = "claro" | "oscuro";

const TONOS: Record<TonoLogo, CSSProperties> = {
  oscuro: {
    "--logo-texto": "var(--hueso)",
    "--logo-apagado": "var(--bloque)",
    "--logo-linea": "var(--superficie)",
  } as CSSProperties,
  claro: {
    "--logo-texto": "var(--tinta)",
    "--logo-apagado": "var(--apagado-arriba)",
    "--logo-linea": "#5F7D00",
  } as CSSProperties,
};

/**
 * Geometría del símbolo: la punta del iceberg encima de la superficie (línea) y el
 * bloque grande debajo, que es lo que mira la auditoría. Misma que `SIMBOLO` en
 * scripts/marca/logo_svg.py, de donde salen los ficheros de marca/, el favicon y
 * og.png: si cambia aquí, cambiarla allí y regenerar (marca/LEEME.md).
 * Dentro de una caja de 48 × 48.
 */
function PiezasSimbolo() {
  return (
    <>
      <path d="M14 21.5 23 7.5l11 14z" fill="var(--logo-texto)" />
      <path d="M4 21.5h40" fill="none" stroke="var(--logo-linea)" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M10 25.5h28l5.5 8.5-9 10.5H17L5.5 33z"
        fill="var(--logo-apagado)"
        fillOpacity="0.16"
        stroke="var(--logo-apagado)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </>
  );
}

/** Solo el iceberg. El tamaño sale de `className`; decorativo (`aria-hidden`). */
export function Simbolo({
  className,
  tono = "oscuro",
  style,
}: {
  className?: string;
  tono?: TonoLogo;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ ...TONOS[tono], ...style }}
    >
      <PiezasSimbolo />
    </svg>
  );
}

/**
 * Logo completo: símbolo + «under» fino y apagado + «tactics» en negrita, a curvas
 * (marca/undertactics-logo-*.svg) en un solo SVG en línea: sin petición ni salto.
 * Sin `<title>` ni `role`: el nombre accesible lo lleva el enlace que lo contiene
 * («Undertactics, inicio»). El tamaño sale del `font-size` de quien lo usa
 * (clases `text-*`): el símbolo mide 1,3em de alto, como antes.
 */
export function Logo({
  className,
  tono = "oscuro",
  style,
}: {
  className?: string;
  tono?: TonoLogo;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: "block", height: "1.3em", width: "auto", aspectRatio: "727.3 / 130", ...TONOS[tono], ...style }}
    >
      <g transform={LOGO_GRUPO}>
        <PiezasSimbolo />
      </g>
      <path fill="var(--logo-apagado)" d={TRAZADO_UNDER} />
      <path fill="var(--logo-texto)" d={TRAZADO_TACTICS} />
    </svg>
  );
}
