"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor personalizado: punto con lerp rápido, anillo con más retardo.
 * No se monta en táctil (comprobado por el propio componente Cursor).
 */
export function useCursor(ready: boolean) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // `ready` llega en false en el primer render (el propio Cursor decide si se
    // monta tras comprobar "pointer: coarse"), así que en ese momento dot/ring
    // todavía no existen. Sin `ready` en las deps este efecto no se repetía
    // cuando las refs por fin quedaban attacheadas: el cursor no se movía nunca.
    if (!ready) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (prefersReduced) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        ring.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };
    window.addEventListener("pointermove", onMove);
    if (prefersReduced) return () => window.removeEventListener("pointermove", onMove);

    const loop = () => {
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ready]);

  return { dotRef, ringRef };
}
