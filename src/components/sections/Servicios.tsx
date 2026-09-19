"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, registerGsap } from "@/lib/gsap";
import { servicios } from "@/content/servicios";
import { useReveal } from "@/hooks/useReveal";

export function Servicios() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal<HTMLParagraphElement>();
  const [active, setActive] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [openMobile, setOpenMobile] = useState<number | null>(null);

  useEffect(() => {
    // Detección de capacidad del cliente: difiere del prerender a propósito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const section = sectionRef.current;
    const float = floatRef.current;
    if (!section || !float) return;

    let mouseX = 0;
    let mouseY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      x += (mouseX - x) * 0.15;
      y += (mouseY - y) * 0.15;
      float.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  useEffect(() => {
    const float = floatRef.current;
    if (!float || isTouch) return;
    registerGsap();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(float, { opacity: active !== null ? 1 : 0 });
      return;
    }

    if (active !== null) {
      gsap.to(float, {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(float, {
        opacity: 0,
        clipPath: "inset(50% 50% 50% 50%)",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [active, isTouch]);

  return (
    <section id="servicios" className="container-max py-[var(--space-section)]">
      <p ref={revealRef} className="font-mono-label mb-12" data-reveal>
        Servicios
      </p>

      {!isTouch && (
        <div
          ref={floatRef}
          className="pointer-events-none fixed left-0 top-0 z-30 h-56 w-80 overflow-hidden rounded-xl opacity-0"
          style={{ clipPath: "inset(50% 50% 50% 50%)" }}
          aria-hidden="true"
        >
          {active !== null && (
            <Image src={servicios[active].imagen} alt="" fill className="object-cover" sizes="320px" />
          )}
        </div>
      )}

      <div ref={sectionRef} onMouseLeave={() => !isTouch && setActive(null)}>
        {servicios.map((servicio, i) => (
          <div key={servicio.numero} className="border-b border-line first:border-t">
            <button
              type="button"
              className="flex w-full items-center gap-6 py-8 text-left transition-opacity duration-300"
              style={{ opacity: isTouch || active === null || active === i ? 1 : 0.35 }}
              onMouseEnter={() => !isTouch && setActive(i)}
              onFocus={() => !isTouch && setActive(i)}
              onClick={() => isTouch && setOpenMobile(openMobile === i ? null : i)}
              aria-expanded={isTouch ? openMobile === i : undefined}
            >
              <span className="font-mono-label w-10 shrink-0 text-sm">{servicio.numero}</span>
              <span className="flex-1 text-2xl font-medium text-text-primary md:text-4xl">
                {servicio.nombre}
              </span>
              <span className="font-mono-label text-2xl" aria-hidden="true">
                {isTouch && openMobile === i ? "–" : "+"}
              </span>
            </button>
            {isTouch && openMobile === i && (
              <div className="grid gap-4 pb-8 md:grid-cols-2">
                <p className="text-text-muted">{servicio.descripcion}</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={servicio.imagen} alt="" fill className="object-cover" sizes="90vw" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
