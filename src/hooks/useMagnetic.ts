"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Botón magnético: se desplaza hacia el cursor dentro de su propio radio
 * (máximo `max` px) y vuelve con un ease elástico suave al salir.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.4, max = 10) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const x = gsap.utils.clamp(-max, max, relX * strength);
      const y = gsap.utils.clamp(-max, max, relY * strength);
      gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, max]);

  return ref;
}
