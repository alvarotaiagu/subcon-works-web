"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, EASE_INOUT } from "@/lib/gsap";
import { gearPath } from "@/lib/gearPath";
import { PRELOADER_DONE_EVENT } from "../preloaderShared";

/**
 * Variante B — "Tren de engranajes": tres engranajes (pequeño, mediano,
 * grande) arrancan en cadena, cada uno más lento y en sentido contrario al
 * anterior (como un mecanismo real engranando), sincronizados con el
 * contador. Al llegar a 100 todo el conjunto se desliza fuera por el lateral,
 * como si el propio mecanismo arrastrara la cortina consigo.
 */
export function PreloaderGearTrain({ onDone }: { onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<SVGGElement>(null);
  const medRef = useRef<SVGGElement>(null);
  const largeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const count = countRef.current;
    const small = smallRef.current;
    const med = medRef.current;
    const large = largeRef.current;
    if (!overlay || !count || !small || !med || !large) return;

    registerGsap();
    document.body.style.overflow = "hidden";
    gsap.set([small, med, large], { opacity: 0.3, transformOrigin: "50% 50%" });
    gsap.set(overlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });

    const counter = { value: 0 };
    const tl = gsap.timeline({ onComplete: onDone });

    tl.to(
      counter,
      {
        value: 100,
        duration: 1.3,
        ease: "power1.inOut",
        onUpdate: () => {
          count.textContent = String(Math.floor(counter.value)).padStart(3, "0");
        },
      },
      0
    )
      .to(small, { opacity: 1, rotate: 900, duration: 1.3, ease: "power1.in" }, 0)
      .to(med, { opacity: 1, rotate: -560, duration: 0.9, ease: "power1.in" }, 0.35)
      .to(large, { opacity: 1, rotate: 300, duration: 0.55, ease: "power1.in" }, 0.75)
      .call(() => window.dispatchEvent(new Event(PRELOADER_DONE_EVENT)))
      // El mecanismo entero se lleva la cortina consigo: borde de salida
      // en diagonal (no un corte recto), como si lo cizallara al pasar.
      .to(
        overlay,
        {
          clipPath: "polygon(140% -40%, 240% -40%, 240% 140%, 40% 140%)",
          duration: 0.85,
          ease: EASE_INOUT,
        },
        "-=0.1"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const gear = (teeth: number, r: number, cx: number, cy: number) => (
    <>
      <path
        d={gearPath({ cx, cy, teeth, outerR: r, rootR: r * 0.82 })}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx={cx} cy={cy} r={r * 0.22} fill="none" stroke="var(--accent)" strokeWidth={1.5} opacity={0.5} />
    </>
  );

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[90] flex items-center justify-center bg-bg-base" aria-hidden="true">
      <svg viewBox="0 0 420 200" className="h-[30vh] w-[64vh] max-h-52 max-w-[560px]">
        <g ref={smallRef}>{gear(10, 34, 70, 138)}</g>
        <g ref={medRef}>{gear(12, 50, 178, 92)}</g>
        <g ref={largeRef}>{gear(16, 66, 320, 118)}</g>
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
