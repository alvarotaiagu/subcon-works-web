"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Smooth scroll con Lenis sincronizado a ScrollTrigger vía el ticker de GSAP.
 * Desactivado por completo bajo prefers-reduced-motion: el scroll nativo del
 * navegador queda intacto y accesible.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
