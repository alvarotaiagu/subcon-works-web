"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, SplitText, EASE_OUT } from "@/lib/gsap";
import { PRELOADER_DONE_EVENT, PRELOADER_SESSION_KEY } from "@/components/layout/Preloader";
import { Boton } from "@/components/ui/Boton";
import { site } from "@/content/site";
import { HeroGears } from "@/components/three/HeroGears";

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const eyebrow = eyebrowRef.current;
    const h1 = h1Ref.current;
    const rest = restRef.current;
    if (!content || !eyebrow || !h1 || !rest) return;

    const revealTargets = rest.querySelectorAll<HTMLElement>("[data-reveal]");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set([content, eyebrow, h1], { opacity: 1, scale: 1, y: 0, filter: "none" });
      gsap.set(revealTargets, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    registerGsap();
    gsap.set(content, { scale: 1.05, filter: "blur(14px)" });
    gsap.set(eyebrow, { opacity: 0, y: 12 });
    gsap.set(revealTargets, { opacity: 0, y: 24, filter: "blur(6px)" });

    let split: SplitText | null = null;
    let hasPlayed = false;
    let cancelled = false;

    const build = () => {
      split?.revert();
      split = new SplitText(h1, { type: "lines", mask: "lines", linesClass: "hero-line" });
      gsap.set(split.lines, { yPercent: hasPlayed ? 0 : 110 });
    };

    const play = () => {
      if (!split || hasPlayed) return;
      hasPlayed = true;
      // La máscara de línea de SplitText recorta las descendentes (la "g" de
      // "funcionar") porque el line-height de los títulos es 0.98: solo hace
      // falta durante la propia animación, así que se revierte al terminar en
      // vez de dejar el h1 envuelto en overflow:hidden para siempre.
      const tl = gsap.timeline({
        onComplete: () => {
          split?.revert();
          split = null;
        },
      });
      tl.to(content, { scale: 1, filter: "blur(0px)", duration: 1.2, ease: EASE_OUT }, 0)
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT }, 0.05)
        .to(
          split.lines,
          {
            yPercent: 0,
            duration: 0.9,
            ease: EASE_OUT,
            stagger: 0.08,
          },
          0.2
        )
        .to(
          revealTargets,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: EASE_OUT,
            stagger: 0.08,
          },
          "-=0.5"
        );
    };

    const willShowPreloader = !sessionStorage.getItem(PRELOADER_SESSION_KEY);
    if (willShowPreloader) {
      window.addEventListener(PRELOADER_DONE_EVENT, play);
    }

    document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      if (!willShowPreloader) play();
    });

    const onResize = () => {
      // Tras jugar la entrada, el split ya se revirtió (arriba): no hay nada
      // que reconstruir y volver a montar la máscara solo reintroduciría el
      // recorte de descendentes de forma permanente.
      if (hasPlayed) return;
      build();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener(PRELOADER_DONE_EVENT, play);
      split?.revert();
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-32 md:pt-40">
      <Reticula />
      <UmbralFondo />
      <HeroGears />
      <div ref={contentRef} className="container-max relative z-10 will-change-transform">
        <p ref={eyebrowRef} className="font-mono-label mb-6">
          Estudio de diseño, desarrollo y automatización con IA
        </p>
        <h1
          ref={h1Ref}
          className="text-balance text-[clamp(2.75rem,9vw,9rem)] font-medium text-text-primary"
        >
          {site.tagline}
        </h1>
        <div ref={restRef} className="mt-8 max-w-md">
          <p className="text-lg text-text-muted" data-reveal>
            {site.descripcion}
          </p>
          <div className="mt-10 flex flex-wrap gap-4" data-reveal>
            <Boton href="/auditoria/">Auditoría gratis</Boton>
            <Boton href="#plantillas" variante="secundario">
              Ver plantillas
            </Boton>
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
}

/** Retícula de columnas de fondo: se intuye, no compite con el texto. */
function Reticula() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden justify-between px-[var(--gutter)] md:flex"
      aria-hidden="true"
    >
      {Array.from({ length: 13 }).map((_, i) => (
        <span
          key={i}
          className="reticula-line block h-full w-px bg-line/20"
          style={{ animationDelay: `${i * 0.025}s` }}
        />
      ))}
    </div>
  );
}

function UmbralFondo() {
  const ref = useRef<HTMLDivElement>(null);

  // Seguimiento del cursor con lerp.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || prefersReduced) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let x = targetX;
    let y = targetY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };
    el.addEventListener("pointermove", onMove);

    const loop = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      el.style.setProperty("--umbral-x", `${x}px`);
      el.style.setProperty("--umbral-y", `${y}px`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Entrada propia: crece en intensidad al mismo tiempo que el resto del hero.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();
    gsap.set(el, { opacity: 0 });

    const play = () => gsap.to(el, { opacity: 1, duration: 1.6, ease: EASE_OUT });
    const willShowPreloader = !sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (willShowPreloader) {
      window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      return () => window.removeEventListener(PRELOADER_DONE_EVENT, play);
    }
    play();
  }, []);

  return <div ref={ref} aria-hidden="true" className="umbral pointer-events-none absolute inset-0" />;
}

function ScrollIndicator() {
  return (
    <div
      className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      aria-hidden="true"
    >
      <span className="font-mono-label text-[10px]">Scroll</span>
      <span className="relative h-16 w-px overflow-hidden bg-line">
        <span className="scroll-dot absolute left-0 top-0 h-3 w-px bg-accent" />
      </span>
    </div>
  );
}
