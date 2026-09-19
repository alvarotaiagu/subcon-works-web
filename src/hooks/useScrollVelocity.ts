"use client";

import { useEffect } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Publica la velocidad de scroll normalizada (-1..1) en --scroll-velocity,
 * que algunos elementos leen para un skew sutil (máx. 2-3deg) y el marquee
 * para acelerar/frenar con la velocidad real de scroll.
 */
export function useScrollVelocity() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    const root = document.documentElement;
    let raf = 0;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const velocity = gsap.utils.clamp(-2500, 2500, self.getVelocity());
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          root.style.setProperty("--scroll-velocity", (velocity / 2500).toFixed(3));
        });
      },
    });

    return () => {
      trigger.kill();
      cancelAnimationFrame(raf);
    };
  }, []);
}
