"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { servicios } from "@/content/servicios";
import { useReveal } from "@/hooks/useReveal";
import { WorkImage } from "@/components/ui/WorkImage";
import { NodesScene } from "@/components/three/NodesScene";

// El servicio "Agentes y chatbots con IA" muestra la malla de nodos en vez de
// una imagen estática: es el mismo lenguaje visual que la automatización del
// hero, aplicado al único servicio que es literalmente una red de IA.
const NODES_SERVICE_NUMERO = "03";

function NodesPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new NodesScene(canvas, { count: 22, maxDist: 1.5, cameraZ: 9 });
    scene.start((dt, elapsed) => scene.tick(dt, elapsed));
    return () => scene.dispose();
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}

export function Servicios() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal<HTMLParagraphElement>();
  const [active, setActive] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

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

  // El panel arranca cerrado por GSAP, no por un `style` de React: un `style`
  // en JSX se reescribe en cada re-render (cada cambio de `active`) y pisaba
  // la animación en curso, dejando la imagen casi siempre clipeada a un punto.
  useEffect(() => {
    const float = floatRef.current;
    if (!float || isTouch) return;
    registerGsap();
    gsap.set(float, { opacity: 0, clipPath: "inset(50% 50% 50% 50%)" });
  }, [isTouch]);

  const prevActive = useRef<number | null>(null);

  useEffect(() => {
    const float = floatRef.current;
    if (!float || isTouch) return;
    registerGsap();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(float, { opacity: active !== null ? 1 : 0 });
      prevActive.current = active;
      return;
    }

    if (active !== null) {
      const switchingService = prevActive.current !== null && prevActive.current !== active;
      const tl = gsap.timeline();
      if (switchingService) {
        // Cambiar de servicio: cortina rápida que cierra y vuelve a abrir con la nueva imagen.
        tl.to(float, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.25, ease: "power2.in" }).set(
          float,
          { clipPath: "inset(0% 0% 0% 100%)" }
        );
      }
      tl.to(float, {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: switchingService ? 0.45 : 0.5,
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
    prevActive.current = active;
  }, [active, isTouch]);

  return (
    <section id="servicios" className="container-max py-[var(--space-section)]">
      <p ref={revealRef} className="font-mono-label mb-12" data-reveal>
        Servicios
      </p>

      {!isTouch && (
        <div
          ref={floatRef}
          className="pointer-events-none fixed left-0 top-0 z-30 h-56 w-56 opacity-0"
          aria-hidden="true"
        >
          {active !== null &&
            (servicios[active].numero === NODES_SERVICE_NUMERO ? (
              <NodesPreview />
            ) : (
              servicios[active].icono && (
                <WorkImage
                  src={servicios[active].icono}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="224px"
                />
              )
            ))}
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
              onClick={() => isTouch && setOpen(open === i ? null : i)}
              aria-expanded={isTouch ? open === i : undefined}
            >
              <span className="font-mono-label w-10 shrink-0 text-sm">{servicio.numero}</span>
              <span className="flex-1 text-2xl font-medium text-text-primary md:text-4xl">
                {servicio.nombre}
              </span>
              <span className="font-mono-label text-2xl" aria-hidden="true">
                {isTouch && open === i ? "–" : "+"}
              </span>
            </button>

            {/* Vista previa en el hover: un texto corto que aparece bajo el
                título mientras el cursor está encima, sin necesidad de clic.
                En touch no hay hover que la dispare — ahí sigue el acordeón
                de clic de siempre, más abajo. */}
            {!isTouch && (
              <div
                className="grid transition-[grid-template-rows] duration-400 ease-out"
                style={{ gridTemplateRows: active === i ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-md pb-6 text-text-muted">{servicio.descripcion}</p>
                </div>
              </div>
            )}

            {isTouch && open === i && (
              <div className="grid gap-4 pb-8 md:grid-cols-2">
                <p className="text-text-muted">{servicio.descripcion}</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <WorkImage src={servicio.imagen} alt="" fill className="object-cover" sizes="90vw" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
