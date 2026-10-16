"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { cargarGsap } from "@/lib/gsap";

/** La instancia viva, para los saltos programáticos (`irAAncla`). */
let instancia: Lenis | null = null;

/**
 * La instancia de Lenis, o `null` si no hay: con reduced-motion, antes de
 * que llegue, después de `destroy` o si no ha cargado.
 */
export function getLenis(): Lenis | null {
  return instancia;
}

/**
 * Smooth scroll con Lenis sincronizado a ScrollTrigger vía el ticker de GSAP.
 * Desactivado por completo bajo prefers-reduced-motion: el scroll nativo del
 * navegador queda intacto y accesible.
 *
 * Lenis y GSAP llegan con `import()` tras hidratar (D-028). Hasta entonces, y
 * si no llegan, el scroll es el nativo.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let vivo = true;
    let quitar = () => {};

    Promise.all([cargarGsap(), import("lenis")])
      .then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
        if (!vivo) return;
        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          wheelMultiplier: 1,
          touchMultiplier: 1.2,
        });

        lenis.on("scroll", ScrollTrigger.update);
        instancia = lenis;

        const tick = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        quitar = () => {
          gsap.ticker.remove(tick);
          if (instancia === lenis) instancia = null;
          lenis.destroy();
        };
      })
      .catch(() => {
        // Sin GSAP o sin Lenis: scroll nativo (§6).
      });

    return () => {
      vivo = false;
      quitar();
    };
  }, []);
}
