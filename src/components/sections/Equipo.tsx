"use client";

import Link from "next/link";
import { entradaEstudio, personas } from "@/content/estudio";
import { TarjetaPersona } from "@/components/ui/TarjetaPersona";
import { useReveal } from "@/hooks/useReveal";

export function Equipo() {
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section id="equipo" className="container-max py-[var(--space-section)]">
      <div ref={revealRef} className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono-label mb-4" data-reveal>
            Quién hace esto
          </p>
          <h2 className="text-4xl font-medium text-text-primary md:text-6xl" data-reveal>
            Somos dos, y hablas con quien lo hace.
          </h2>
          <p className="mt-8 max-w-md text-lg text-text-muted" data-reveal>
            {entradaEstudio}
          </p>
          <div className="mt-10" data-reveal>
            <Link href="/estudio/" className="link-underline font-mono-label text-xs text-accent">
              Cómo trabajamos →
            </Link>
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
          {personas.map((persona) => (
            <div key={persona.nombre} data-reveal>
              <TarjetaPersona
                persona={persona}
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
