"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Boton } from "@/components/ui/Boton";
import { gsap, registerGsap } from "@/lib/gsap";
import { plantillas, plantillasDestacadas } from "@/content/plantillas";
import { TarjetaPlantilla } from "@/components/ui/TarjetaPlantilla";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";

export function Plantillas() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
    <Seccion
      id="plantillas"
      ref={sectionRef}
      className="overflow-hidden py-[var(--space-section)] md:flex md:min-h-screen md:flex-col md:justify-center md:py-16"
    >
      {/* En desktop la sección queda pin:true durante el scrub horizontal, así que
          su alto se congela tal cual está al empezar el pin: si el bloque de título +
          tarjetas es más alto que eso, las tarjetas quedan por debajo del punto donde
          se congeló y se ven "muy abajo". Centrarlo en min-h-screen evita que el
          padding superior empuje las tarjetas fuera del alto pineado. */}
      <div className="container-max mb-10 md:mb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Titular
            nivel={2}
            arriba={`${plantillas.length} bases propias, ya construidas y en línea.`}
            className="max-w-2xl"
          />
          <Link
            href="/plantillas/"
            className="link-underline font-mono-label shrink-0 text-xs text-hueso"
          >
            Ver las {plantillas.length} <Glifo nombre="derecha" />
          </Link>
        </div>
        <p className="mt-6 max-w-xl text-apagado-abajo">
          Cada una parte de una idea distinta, no de la misma retícula con otro color. Si una encaja
          con lo tuyo, se adapta con tus datos y está en línea en dos semanas.{" "}
          <strong className="font-medium text-hueso">
            Los negocios que ves son inventados
          </strong>{" "}
          — son escaparates de lo que se construye, no clientes.
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-[var(--gutter)] pb-4 md:w-max md:snap-none md:overflow-visible md:pb-0"
      >
        {plantillasDestacadas.map((plantilla) => (
          <TarjetaPlantilla
            key={plantilla.slug}
            plantilla={plantilla}
            className="w-[85vw] shrink-0 snap-center md:w-[420px]"
          />
        ))}

        <div className="flex w-[85vw] shrink-0 snap-center items-center md:w-[360px]">
          <div>
            <p className="text-3xl font-medium text-hueso">
              Y {plantillas.length - plantillasDestacadas.length} más.
            </p>
            <p className="mt-4 text-apagado-abajo">
              Abogacía, óptica, panadería, autoescuela, mudanzas, cerámica, seguridad… Todas
              publicadas y todas se pueden abrir y trastear ahora mismo.
            </p>
            <Boton href="/plantillas/" className="mt-8">
              Ver el catálogo entero
            </Boton>
          </div>
        </div>
      </div>
    </Seccion>
  );
}
