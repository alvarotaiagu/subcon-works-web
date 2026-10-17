"use client";

import type { gsap as GsapCore } from "gsap";
import type { ScrollTrigger as ScrollTriggerT } from "gsap/ScrollTrigger";

export const EASE_OUT = "undertactics-out";
export const EASE_INOUT = "undertactics-inout";

export type Gsap = typeof GsapCore;
export type ScrollTrigger = ScrollTriggerT;
export type Movimiento = { gsap: Gsap; ScrollTrigger: typeof ScrollTriggerT };

/**
 * GSAP, ScrollTrigger y CustomEase llegan con `import()` después de hidratar (D-028): no
 * van en el JS inicial y su evaluación no se suma al arranque de Next (§3.15). Nada de lo
 * que se ve depende de que lleguen: los estados iniciales están en CSS y, si el import
 * falla, cada zona se queda en su versión quieta (§6 «Sin GSAP»).
 *
 * Ningún módulo importa `gsap` de forma estática: con uno solo volvería al bundle inicial.
 */
let cargado: Movimiento | null = null;
let promesa: Promise<Movimiento> | null = null;
const esperando = new Set<(m: Movimiento) => void>();

/** Una tarea nueva del bucle de eventos (no una microtarea). */
const tareaNueva = () => new Promise<void>((r) => setTimeout(r, 0));

/**
 * Pide GSAP (una sola vez) y lo registra. Rechaza si el chunk no llega.
 *
 * Cada llamada se resuelve en su propia tarea: si las zonas que esperan (el pin del
 * proceso, Lenis, el ancla) montaran lo suyo en las microtareas de la llegada, todo iría
 * en una sola tarea larga (§3.15).
 */
export function cargarGsap(): Promise<Movimiento> {
  promesa ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/CustomEase")]).then(
    ([{ gsap }, { ScrollTrigger }, { CustomEase }]) => {
      gsap.registerPlugin(ScrollTrigger, CustomEase);
      CustomEase.create(EASE_OUT, "0.16, 1, 0.3, 1");
      CustomEase.create(EASE_INOUT, "0.65, 0, 0.35, 1");
      const m: Movimiento = { gsap, ScrollTrigger };
      cargado = m;
      // Un aviso que falla no tumba la carga: los demás y quien espera la promesa siguen.
      esperando.forEach((aviso) => {
        try {
          aviso(m);
        } catch (e) {
          console.error(e);
        }
      });
      esperando.clear();
      return m;
    },
    (e) => {
      // Un chunk que no llega no se queda cacheado: la siguiente petición lo reintenta.
      promesa = null;
      throw e;
    },
  );
  return promesa.then(async (m) => {
    await tareaNueva();
    return m;
  });
}

/** GSAP si ya ha llegado; `null` si no se ha pedido, está en camino o ha fallado. */
export function gsapCargado(): Movimiento | null {
  return cargado;
}

/**
 * Avisa cuando llegue GSAP, sin pedirlo: para quien solo lo usa si está (el hilo, que mira
 * el pin del proceso). Si ya está, avisa en el acto. Devuelve la baja.
 */
export function alCargarGsap(aviso: (m: Movimiento) => void): () => void {
  if (cargado) {
    aviso(cargado);
    return () => {};
  }
  esperando.add(aviso);
  return () => esperando.delete(aviso);
}
