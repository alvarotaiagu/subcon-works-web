"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, EASE_INOUT } from "@/lib/gsap";
import { gearPath } from "@/lib/gearPath";
import { PRELOADER_DONE_EVENT } from "../preloaderShared";

const CX = 110;
const CY = 110;
const ROOT_R = 68;
const OUTER_R = 82;
const TEETH = 14;

/**
 * Variante C — "El engranaje se aquieta": gira despacio de fondo mientras
 * cuenta. Al llegar a 100 los dientes se retraen (el contorno se recalcula
 * fotograma a fotograma, sin plugin de morphing) hasta quedar en un anillo
 * liso — el mecanismo "se para" — y solo entonces la pantalla se disuelve.
 */
export function PreloaderGearMorph({ onDone }: { onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const count = countRef.current;
    const gear = gearRef.current;
    const group = groupRef.current;
    if (!overlay || !count || !gear || !group) return;

    registerGsap();
    document.body.style.overflow = "hidden";

    const idleSpin = gsap.to(group, { rotate: 360, duration: 8, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

    const counter = { value: 0 };
    const shape = { outerR: OUTER_R };
    const tl = gsap.timeline({
      onComplete: () => {
        idleSpin.kill();
        onDone();
      },
    });

    tl.to(
      counter,
      {
        value: 100,
        duration: 1.3,
        ease: "power2.inOut",
        onUpdate: () => {
          count.textContent = String(Math.floor(counter.value)).padStart(3, "0");
        },
      },
      0
    )
      .call(() => window.dispatchEvent(new Event(PRELOADER_DONE_EVENT)))
      // Los dientes se retraen: el radio exterior converge con el interior
      // y el contorno, recalculado en cada frame, se vuelve un anillo liso.
      .to(idleSpin, { timeScale: 3.5, duration: 0.5, ease: "power2.in" }, "-=0.05")
      .to(
        shape,
        {
          outerR: ROOT_R,
          duration: 0.5,
          ease: "power3.in",
          onUpdate: () => {
            gear.setAttribute(
              "d",
              gearPath({ cx: CX, cy: CY, teeth: TEETH, outerR: shape.outerR, rootR: ROOT_R })
            );
          },
        },
        "<"
      )
      .to(group, { scale: 0.9, duration: 0.3, ease: "power2.out" }, "-=0.15")
      // El mecanismo ya está quieto: la pantalla se disuelve sobre él.
      .to(overlay, { opacity: 0, scale: 1.04, duration: 0.7, ease: EASE_INOUT });

    return () => {
      tl.kill();
      idleSpin.kill();
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-bg-base"
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 220" className="h-[38vh] w-[38vh] max-h-64 max-w-64">
        <g ref={groupRef}>
          <path
            ref={gearRef}
            d={gearPath({ cx: CX, cy: CY, teeth: TEETH, outerR: OUTER_R, rootR: ROOT_R })}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <circle cx={CX} cy={CY} r={30} fill="none" stroke="var(--accent)" strokeWidth={1.5} opacity={0.5} />
        </g>
        <circle cx={CX} cy={CY} r={3} fill="var(--accent)" />
      </svg>
      <div
        ref={countRef}
        className="font-mono-label absolute bottom-6 right-6 text-[18vw] leading-none text-text-primary md:bottom-10 md:right-10 md:text-[8vw]"
      >
        000
      </div>
    </div>
  );
}
