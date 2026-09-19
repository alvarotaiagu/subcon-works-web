"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, registerGsap, EASE_INOUT } from "@/lib/gsap";

/** Overlay que cubre y descubre en cada cambio de ruta. */
export function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

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
      className="pointer-events-none fixed inset-0 z-[95] translate-y-full bg-bg-base"
      aria-hidden="true"
    />
  );
}
