"use client";

import { useEffect, useRef, useState } from "react";

interface CifraGaugeProps {
  valor: number;
  sufijo?: string;
  duracion?: number;
}

/**
 * Contador con anillo de esfera de instrumento: el trazo se dibuja al mismo
 * ritmo que el número cuenta, no representa una fracción de un máximo real
 * (varias cifras son "+", sin techo) — es la lectura materializándose, como
 * una aguja que se posa, no una barra de progreso.
 */
export function CifraGauge({ valor, sufijo = "", duracion = 1400 }: CifraGaugeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    const ring = ringRef.current;
    if (!el || !ring) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setProgress = (p: number) => {
      ring.style.strokeDashoffset = String(1 - p);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (prefersReduced) {
          setDisplay(valor);
          setProgress(1);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duracion);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * valor));
          setProgress(eased);
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
    <div ref={wrapRef} className="relative inline-flex h-28 w-28 shrink-0 items-center justify-center md:h-32 md:w-32">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <circle
          ref={ringRef}
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </svg>
      <p className="px-2 text-center text-2xl font-medium leading-none text-text-primary md:text-3xl">
        {display}
        {sufijo}
      </p>
    </div>
  );
}
