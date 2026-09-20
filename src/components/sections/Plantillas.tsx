"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { plantillas } from "@/content/plantillas";
import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { useReveal } from "@/hooks/useReveal";

export function Plantillas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = track.scrollWidth - section.offsetWidth;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="plantillas"
      ref={sectionRef}
      className="overflow-hidden py-[var(--space-section)] md:flex md:min-h-screen md:flex-col md:justify-center md:py-16"
    >
      {/* En desktop la sección queda pin:true durante el scrub horizontal, así que
          su alto se congela tal cual está al empezar el pin: si el bloque de título +
          tarjetas es más alto que eso, las tarjetas quedan por debajo del punto donde
          se congeló y se ven "muy abajo". Centrarlo en min-h-screen evita que el
          padding superior empuje las tarjetas fuera del alto pineado. */}
      <div ref={revealRef} className="container-max mb-12 md:mb-8">
        <p className="font-mono-label mb-4" data-reveal>
          Plantillas
        </p>
        <h2 className="max-w-2xl text-4xl font-medium text-text-primary md:text-6xl" data-reveal>
          Bases propias, listas para adaptar a tu negocio.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-[var(--gutter)] pb-4 md:w-max md:snap-none md:overflow-visible md:pb-0"
      >
        {plantillas.map((plantilla) => (
          <div key={plantilla.nombre} className="w-[85vw] shrink-0 snap-center md:w-[420px]">
            <BrowserMockup src={plantilla.imagen} alt={`Mockup de la plantilla ${plantilla.nombre}`} />
            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-2xl font-medium text-text-primary">{plantilla.nombre}</p>
                <span className="font-mono-label shrink-0 text-xs">{plantilla.sector}</span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {plantilla.incluye.map((item) => (
                  <li key={item}>
                    <Etiqueta>{item}</Etiqueta>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
