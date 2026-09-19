"use client";

import { useEffect, useRef, useState } from "react";

interface ContadorProps {
  valor: number;
  sufijo?: string;
  duracion?: number;
}

/** Contador animado con IntersectionObserver (no ScrollTrigger), dispara una sola vez. */
export function Contador({ valor, sufijo = "", duracion = 1400 }: ContadorProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (prefersReduced) {
          setDisplay(valor);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duracion);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * valor));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [valor, duracion]);

  return (
    <span ref={ref}>
      {display}
      {sufijo}
    </span>
  );
}
