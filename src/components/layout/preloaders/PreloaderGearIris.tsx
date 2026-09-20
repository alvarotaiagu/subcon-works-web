"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, EASE_INOUT } from "@/lib/gsap";
import { gearPath } from "@/lib/gearPath";
import { PRELOADER_DONE_EVENT } from "../preloaderShared";

/**
 * Variante A — "Engranaje maestro": un único engranaje se dibuja a sí mismo
 * (stroke-dashoffset) al ritmo del contador, gira despacio de fondo, encaja
 * con un golpe de muelle al llegar a 100 y el hueco se cierra sobre su
 * propio centro (iris/obturador de cámara) hasta desaparecer.
 */
export function PreloaderGearIris({ onDone }: { onDone: () => void }) {
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

    const len = gear.getTotalLength();
    gsap.set(gear, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(overlay, { clipPath: "circle(150% at 50% 50%)" });

    const idleSpin = gsap.to(group, { rotate: 360, duration: 7, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        idleSpin.kill();
        onDone();
      },
    });

    tl.to(gear, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0)
      .to(
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
      // Golpe de encaje: el engranaje "muerde" media diente y rebota.
      .to(group, { rotate: "-=18", scale: 1.06, duration: 0.22, ease: "back.out(3)", transformOrigin: "50% 50%" })
      .to(group, { scale: 1, duration: 0.2, ease: "power2.out" })
      // Obturador: el hueco visible del overlay se cierra sobre el centro del engranaje.
      .to(overlay, { clipPath: "circle(0% at 50% 50%)", duration: 0.85, ease: EASE_INOUT }, "-=0.1");

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
            d={gearPath({ cx: 110, cy: 110, teeth: 14, outerR: 82, rootR: 68 })}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <circle cx={110} cy={110} r={30} fill="none" stroke="var(--accent)" strokeWidth={1.5} opacity={0.5} />
        </g>
        <circle cx={110} cy={110} r={3} fill="var(--accent)" />
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
