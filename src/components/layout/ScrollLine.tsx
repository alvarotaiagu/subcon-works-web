"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Hilo de cota fijo en el borde derecho, con el mismo lenguaje de plano
 * técnico que la línea de Proceso: marcas regulares + un tramo que se llena
 * con el progreso real de la página (vía ScrollTrigger, sincronizado con
 * Lenis) y una lectura en tanto por ciento.
 */
export function ScrollLine() {
  const fillRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fill = fillRef.current;
    const readout = readoutRef.current;
    if (!fill || !readout) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    // Vive en el layout raíz, así que no se desmonta al navegar entre rutas;
    // PageTransition mata TODOS los ScrollTrigger en el click de cualquier
    // enlace (lo necesita para las secciones con pin de la home). Sin
    // `pathname` en las deps, este efecto solo corre una vez y el trigger
    // muerto deja el hilo congelado para el resto de la sesión.
    const apply = (progress: number) => {
      gsap.set(fill, { scaleY: progress });
      readout.textContent = `${Math.round(progress * 100)}%`;
    };

    // ScrollLine está antes que `<main>` en el árbol, así que sus efectos
    // corren antes que los de las secciones con pin (Proceso, Plantillas).
    // Si el trigger se crea y refresca aquí mismo, "bottom bottom" mide la
    // página SIN el alto que esas secciones añaden al pinearse, y el hilo
    // llega al 100% antes del final real. Un rAF lo difiere hasta después
    // de que todos los efectos del montaje inicial ya hayan corrido.
    let trigger: ScrollTrigger | undefined;
    const raf = requestAnimationFrame(() => {
      trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      // Al navegar entre rutas, la posición de scroll puede tardar un frame
      // en resetearse a 0 tras el cambio de página; sin este refresh,
      // `trigger` nace con la medida vieja y se queda pintando un progreso
      // equivocado hasta el próximo scroll del usuario.
      ScrollTrigger.refresh();
    });

    // Por si alguna imagen (no las SVG con aspect-ratio fijo) termina de
    // cargar tarde y cambia el alto total tras el refresh de arriba.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      trigger?.kill();
    };
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed right-6 top-24 bottom-16 z-30 hidden w-px md:block lg:right-10"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 w-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--text-faint) 0, var(--text-faint) 3px, transparent 3px, transparent 11px)",
          opacity: 0.35,
        }}
      />
      <div ref={fillRef} className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-accent" />
      <p
        ref={readoutRef}
        className="font-mono-label absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[10px] tabular-nums text-text-faint"
      >
        0%
      </p>
    </div>
  );
}
