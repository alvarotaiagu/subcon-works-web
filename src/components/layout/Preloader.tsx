"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap, EASE_INOUT } from "@/lib/gsap";

export const PRELOADER_SESSION_KEY = "subcon-preloader-seen";
export const PRELOADER_DONE_EVENT = "subcon:preloader-done";

/**
 * Preloader de 2s máximo, solo en la primera visita de la sesión.
 * Al llegar a 100 dispara PRELOADER_DONE_EVENT y la cortina sube revelando
 * el hero: el H1 del hero escucha ese evento para arrancar solapado, no después.
 */
export function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    if (sessionStorage.getItem(PRELOADER_SESSION_KEY)) return;
    // Depende de sessionStorage, no disponible durante el prerender estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    const overlay = overlayRef.current;
    const count = countRef.current;
    if (!overlay || !count) return;

    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    registerGsap();
    document.body.style.overflow = "hidden";

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        overlay.remove();
        document.body.style.overflow = "";
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.floor(counter.value)).padStart(3, "0");
      },
    })
      .call(() => {
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      })
      .to(
        overlay,
        {
          yPercent: -100,
          duration: 0.9,
          ease: EASE_INOUT,
        },
        "-=0.05"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-end justify-end bg-bg-base p-6 md:p-10"
      aria-hidden="true"
    >
      <div
        ref={countRef}
        className="font-mono-label text-[18vw] leading-none text-text-primary md:text-[8vw]"
      >
        000
      </div>
    </div>
  );
}
