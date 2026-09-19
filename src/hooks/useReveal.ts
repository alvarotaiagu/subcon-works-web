"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, EASE_OUT } from "@/lib/gsap";

interface UseRevealOptions {
  /** Separación entre elementos hermanos con data-reveal. */
  stagger?: number;
  /** Punto del viewport en el que dispara el reveal. */
  start?: string;
}

/**
 * Hook único de reveal: opacity 0→1, y 24px→0, blur 6px→0.
 * Marca cualquier descendiente con `data-reveal` para que entre en el stagger.
 * Bajo prefers-reduced-motion cae a un fade de 0.2s sin desplazamiento ni blur.
 */
export function useReveal<T extends HTMLElement>(options: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const stagger = options.stagger ?? 0.07;
  const start = options.start ?? "top 82%";

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.hasAttribute("data-reveal")
      ? [root]
      : Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const ctx = gsap.context(() => {
        gsap.set(targets, { opacity: 1, y: 0, filter: "none" });
        targets.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }
          );
        });
      }, root);
      return () => ctx.revert();
    }

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 24, filter: "blur(6px)" });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: EASE_OUT,
        stagger,
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [stagger, start]);

  return ref;
}
