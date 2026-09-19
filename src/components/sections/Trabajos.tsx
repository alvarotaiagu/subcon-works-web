"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { WorkImage } from "@/components/ui/WorkImage";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { trabajos } from "@/content/trabajos";
import { useReveal } from "@/hooks/useReveal";
import { gsap, registerGsap } from "@/lib/gsap";

export function Trabajos() {
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.08 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    const images = gsap.utils.toArray<HTMLElement>(".trabajo-parallax", grid);
    const triggers = images.map((img) =>
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    );

    return () => {
      triggers.forEach((t) => t.scrollTrigger?.kill());
    };
  }, []);

  return (
    <section id="trabajos" className="container-max py-[var(--space-section)]">
      <div ref={revealRef}>
        <p className="font-mono-label mb-4" data-reveal>
          Trabajos
        </p>
        <h2 className="max-w-2xl text-4xl font-medium text-text-primary md:text-6xl" data-reveal>
          Casos reales, no mockups de agencia.
        </h2>
      </div>

      <div ref={gridRef} className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {trabajos.map((trabajo) => (
          <Link
            key={trabajo.slug}
            href={`/trabajos/${trabajo.slug}/`}
            className="trabajo-card group block"
            data-cursor-hover
            data-cursor-label="Ver"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <div className="trabajo-parallax absolute inset-[-6%]">
                <WorkImage
                  src={trabajo.imagenPortada}
                  alt={`Captura del sitio de ${trabajo.cliente}`}
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="trabajo-img object-cover"
                />
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xl font-medium text-text-primary">{trabajo.cliente}</p>
                <p className="text-sm text-text-muted">{trabajo.sector}</p>
              </div>
              <span className="font-mono-label shrink-0 text-xs">{trabajo.año}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {trabajo.etiquetas.map((etiqueta) => (
                <Etiqueta key={etiqueta}>{etiqueta}</Etiqueta>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
