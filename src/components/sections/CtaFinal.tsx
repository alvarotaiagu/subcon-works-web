"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { Boton } from "@/components/ui/Boton";
import { ScrollScene } from "@/components/three/ScrollScene";
import { BlobScene } from "@/components/three/BlobScene";

export function CtaFinal() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const makeBlobScene = useCallback((canvas: HTMLCanvasElement) => new BlobScene(canvas, { interactive: false }), []);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = text.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      gsap.to(text, {
        x: gsap.utils.clamp(-8, 8, relX * 16),
        y: gsap.utils.clamp(-8, 8, relY * 16),
        duration: 0.6,
        ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="contacto"
      className="container-max relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden text-center"
    >
      <ScrollScene
        factory={makeBlobScene}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40"
      />
      <div className="relative z-10">
        <p className="font-mono-label mb-8">¿Hablamos?</p>
        <h2
          ref={textRef}
          className="text-balance text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.95] text-text-primary will-change-transform"
        >
          Cuéntanos qué te está costando dinero.
        </h2>
        <div className="mt-12">
          <Boton href={`mailto:${site.email}`}>Escríbenos</Boton>
        </div>
      </div>
    </section>
  );
}
