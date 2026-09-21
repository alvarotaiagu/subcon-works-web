"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, registerGsap, EASE_INOUT } from "@/lib/gsap";
import { gearPath } from "@/lib/gearPath";

export const PRELOADER_SESSION_KEY = "subcon-preloader-seen";
export const PRELOADER_DONE_EVENT = "subcon:preloader-done";

/**
 * Preloader de ~2.5s máximo, solo en la primera visita de la sesión: un
 * engranaje se dibuja a sí mismo al ritmo del contador, gira, encaja con un
 * golpe de muelle al llegar a 100 y la pantalla se cierra como un obturador
 * de cámara sobre su propio centro, revelando el hero. Al llegar a 100
 * dispara PRELOADER_DONE_EVENT y el H1 del hero escucha ese evento para
 * arrancar solapado, no después.
 *
 * La cortina se renderiza siempre por defecto (server y primer render
 * cliente) para que esté en el HTML desde el primer pintado: decidir si
 * mostrarla dentro de un useEffect normal deja un frame de por medio en el
 * que el sitio se ve sin cortina antes de que React la monte encima. El
 * salto (ya vista en esta sesión / reduced-motion) se decide en
 * useLayoutEffect, antes de que el navegador pinte.
 */
export function Preloader() {
  const [skip, setSkip] = useState(false);
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || sessionStorage.getItem(PRELOADER_SESSION_KEY)) {
      setSkip(true);
      setVisible(false);
      return;
    }
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (skip) return;
    const overlay = overlayRef.current;
    const count = countRef.current;
    const gear = gearRef.current;
    const group = groupRef.current;
    if (!overlay || !count || !gear || !group) return;

    registerGsap();

    const len = gear.getTotalLength();
    gsap.set(gear, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(overlay, { clipPath: "circle(150% at 50% 50%)" });

    const idleSpin = gsap.to(group, {
      rotate: 360,
      duration: 7,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        idleSpin.kill();
        // No usar overlay.remove(): React sigue creyendo montado este nodo
        // (skip no cambia), y al navegar de página la siguiente
        // reconciliación intenta hacer removeChild sobre un nodo que ya no
        // es hijo de nadie. El desmontado tiene que pasar por React.
        setVisible(false);
        document.body.style.overflow = "";
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
      .call(() => {
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      })
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
  }, [skip]);

  if (skip || !visible) return null;

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
