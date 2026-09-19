"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { proceso } from "@/content/proceso";

export function Proceso() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      setPinned(true);
      const steps = proceso.length;
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${steps * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(steps - 1, Math.floor(self.progress * steps));
          setActive(idx);
          gsap.set(line, { scaleY: self.progress });
        },
      });

      return () => {
        trigger.kill();
        setPinned(false);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="proceso" ref={sectionRef} className="container-max py-[var(--space-section)] md:py-0">
      <div className="grid gap-16 md:h-screen md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono-label mb-10">Proceso</p>
          {pinned ? (
            // Fijado: solo el paso activo ocupa espacio (superpuestos, no apilados),
            // así el bloque nunca puede desbordar la altura fijada de la pantalla.
            <div className="relative min-h-[13rem] md:min-h-[16rem]">
              {proceso.map((paso, i) => (
                <div
                  key={paso.numero}
                  className="absolute inset-0 transition-[opacity,transform] duration-500 ease-out"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? "translateY(0)" : "translateY(8px)",
                  }}
                  aria-hidden={active === i ? undefined : true}
                >
                  <p className="font-mono-label mb-2">{paso.numero}</p>
                  <p className="text-3xl font-medium text-text-primary md:text-5xl">{paso.titulo}</p>
                  <p className="mt-2 max-w-sm text-text-muted">{paso.descripcion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10 md:space-y-12">
              {proceso.map((paso) => (
                <div key={paso.numero}>
                  <p className="font-mono-label mb-2">{paso.numero}</p>
                  <p className="text-3xl font-medium text-text-primary md:text-5xl">{paso.titulo}</p>
                  <p className="mt-2 max-w-sm text-text-muted">{paso.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative hidden h-80 items-center justify-center md:flex">
          <div className="relative h-full w-px bg-line">
            <div ref={lineRef} className="absolute left-0 top-0 h-full w-full origin-top scale-y-0 bg-accent" />
            <div className="absolute inset-0 flex flex-col justify-between">
              {proceso.map((paso, i) => (
                <span
                  key={paso.numero}
                  className="-ml-[5px] flex h-[11px] w-[11px] items-center justify-center rounded-full border transition-colors duration-500"
                  style={{
                    borderColor: active >= i ? "var(--accent)" : "var(--line)",
                    backgroundColor: active >= i ? "var(--accent)" : "var(--bg-base)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
