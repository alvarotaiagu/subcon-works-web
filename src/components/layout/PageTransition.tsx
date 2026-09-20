"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, registerGsap, EASE_INOUT, ScrollTrigger } from "@/lib/gsap";

/** Overlay que cubre y descubre en cada cambio de ruta. */
export function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    // Proceso y Plantillas usan ScrollTrigger con pin:true, que envuelve la
    // sección en un pin-spacer y la reparenta. Al navegar a otra ruta, React
    // desmonta toda la home en un único commit; si el pin todavía no se ha
    // revertido cuando le toca a esa sección, su nodo ya no cuelga de <main>
    // y el removeChild de React explota con NotFoundError. Matarlos aquí, en
    // el click, deja el DOM ya desenganchado del pin antes de que React
    // empiece a desmontar nada.
    const onLinkClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("#") || anchor.getAttribute("target") === "_blank") return;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const overlay = overlayRef.current;
    if (!overlay) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    // La posición inicial viene de la clase CSS .page-transition-hidden (transform:
    // translateY(100%)), no de GSAP. GSAP la lee como un offset "y" en píxeles y lo
    // arrastraría sumado al yPercent que anima a continuación, dejando la cortina a
    // medio camino al terminar. Se limpia ese "y" heredado antes de animar.
    gsap.set(overlay, { y: 0 });
    const tl = gsap.timeline();
    tl.fromTo(overlay, { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: EASE_INOUT }).to(
      overlay,
      { yPercent: -100, duration: 0.5, ease: EASE_INOUT, delay: 0.05 }
    );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="page-transition-hidden pointer-events-none fixed inset-0 z-[95] bg-bg-base"
      aria-hidden="true"
    />
  );
}
