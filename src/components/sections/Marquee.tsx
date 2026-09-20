"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { plantillas } from "@/content/plantillas";

// Banda de arriba: los sectores del catálogo. Es lo que sabemos construir y
// cada uno tiene detrás una demo viva que se puede abrir. No son clientes, y
// la sección Plantillas lo dice con todas las letras.
const sectores = Array.from(new Set(plantillas.map((p) => p.sector)));

// Banda de abajo, en sentido contrario: lo que el sistema hace por sí solo.
//
// No son condiciones comerciales ("sin permanencia", "precio cerrado"): eso es
// lenguaje de presupuesto y aquí lo que se enseña es capacidad. Cada una está
// en tercera persona, como acciones que ocurren sin que estés tú, y todas
// corresponden a un servicio de src/content/servicios.ts — nada que no se
// pueda entregar. El estribillo en acento las encuadra cada vuelta.
const ESTRIBILLO = "Mientras tú atiendes";

const loQueHaceSolo = [
  "Coge el teléfono",
  "Da la cita",
  "Recuerda la cita",
  "Emite la factura",
  "Reclama el pago",
  "Contesta la reseña",
  "Ordena el correo",
  "Filtra lo urgente",
  "Avisa de la revisión",
  "Resume el mes",
];

interface BandaProps {
  items: string[];
  /** -1 recorre hacia la izquierda; 1, hacia la derecha. */
  sentido: 1 | -1;
  duracion: number;
  separador: string;
  className?: string;
  /** Va delante de la lista y en acento: al repetirse en bucle, encuadra lo
   *  que viene detrás sin necesidad de un titular fijo. */
  estribillo?: string;
}

function Banda({ items, sentido, duracion, separador, className, estribillo }: BandaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();

    let tween: gsap.core.Tween | null = null;
    let hovering = false;
    let raf = 0;

    const build = () => {
      tween?.kill();
      // La pista lleva la lista dos veces: al recorrer justo la mitad, el
      // segundo juego está donde estaba el primero y el salto no se ve.
      const distance = track.scrollWidth / 2;
      gsap.set(track, { x: sentido === -1 ? 0 : -distance });
      tween = gsap.to(track, {
        x: sentido === -1 ? -distance : 0,
        duration: duracion,
        ease: "none",
        repeat: -1,
      });
    };
    build();

    const loop = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--scroll-velocity");
      const velocity = Math.abs(parseFloat(raw) || 0);
      const boost = 1 + Math.min(2, velocity * 3);
      tween?.timeScale(hovering ? 0.15 : boost);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);
    wrapper.addEventListener("mouseenter", onEnter);
    wrapper.addEventListener("mouseleave", onLeave);

    const onResize = () => build();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      tween?.kill();
      wrapper.removeEventListener("mouseenter", onEnter);
      wrapper.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [sentido, duracion]);

  return (
    <div ref={wrapperRef} className="overflow-hidden" aria-hidden="true">
      <div ref={trackRef} className="flex w-max items-center whitespace-nowrap">
        {[...items, ...items].map((item, i) => {
          const esEstribillo = item === estribillo;
          return (
            <span key={i} className="flex items-center gap-10 px-5">
              <span
                className={
                  esEstribillo
                    ? "font-mono-label text-sm text-accent"
                    : `font-mono-label text-sm normal-case tracking-normal ${
                        className ?? "text-text-muted"
                      }`
                }
              >
                {item}
              </span>
              <span className="text-accent">{separador}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="border-y border-line">
      <p className="sr-only">
        Sectores con plantilla propia publicada: {sectores.join(", ")}. Y lo que funciona solo
        mientras tú atiendes: {loQueHaceSolo.join(", ").toLowerCase()}.
      </p>

      <div className="border-b border-line/60 py-6">
        <Banda items={sectores} sentido={-1} duracion={38} separador="/" />
      </div>
      <div className="py-6">
        <Banda
          items={[ESTRIBILLO, ...loQueHaceSolo]}
          estribillo={ESTRIBILLO}
          sentido={1}
          duracion={34}
          separador="·"
          className="text-text-faint"
        />
      </div>
    </div>
  );
}
