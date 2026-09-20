"use client";

import Link from "next/link";
import { loQueRecibes, loQueNoPedimos, TOTAL_PREGUNTAS } from "@/content/auditoria";
import { useReveal } from "@/hooks/useReveal";

export function Auditoria() {
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.06 });

  return (
    <section id="auditoria" className="border-y border-line bg-bg-sunken">
      <div ref={revealRef} className="container-max py-[var(--space-section)]">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
          {/* Columna izquierda: la oferta. Se queda fija mientras pasa la lista
              de la derecha, que es más alta. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono-label mb-4" data-reveal>
              Auditoría gratuita
            </p>
            <h2
              className="text-4xl font-medium text-text-primary md:text-6xl"
              data-reveal
            >
              Antes de venderte nada, te decimos qué te está costando dinero.
            </h2>
            <p className="mt-8 max-w-md text-lg text-text-muted" data-reveal>
              Contestas {TOTAL_PREGUNTAS} preguntas sobre cómo trabajáis —diez minutos, con tus
              palabras— y te devolvemos un informe con las horas que se van cada semana, lo que
              cuestan al año y qué se arregla primero.
            </p>
            <p className="mt-4 max-w-md text-text-muted" data-reveal>
              Sin coste, sin compromiso y sin que tengas que darnos acceso a nada. Si con el informe
              te apañas por tu cuenta, nos parece bien: al menos ya sabes por dónde ibas sangrando.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6" data-reveal>
              <Link
                href="/auditoria/"
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg-base transition-colors duration-300 hover:bg-accent-dim"
                data-cursor-hover
              >
                Pedir la auditoría
              </Link>
              <span className="font-mono-label text-[10px]">
                10 min · 0 € · sin compromiso
              </span>
            </div>
          </div>

          {/* Columna derecha: qué lleva dentro el informe, y qué no se pide nunca. */}
          <div>
            <ol className="space-y-px">
              {loQueRecibes.map((item, i) => (
                <li
                  key={item.titulo}
                  className="group border-t border-line py-8 last:border-b"
                  data-reveal
                >
                  <div className="flex gap-6">
                    <span className="font-mono-label w-8 shrink-0 pt-1 text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-xl font-medium text-text-primary md:text-2xl">
                        {item.titulo}
                      </p>
                      <p className="mt-2 max-w-md text-text-muted">{item.texto}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded-2xl border border-line bg-bg-raised p-7" data-reveal>
              <p className="font-mono-label mb-4 text-[10px]">Lo que no te vamos a pedir</p>
              <ul className="space-y-2.5">
                {loQueNoPedimos.map((linea) => (
                  <li key={linea} className="flex gap-3 text-sm text-text-muted">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-text-faint">
                La auditoría se hace sobre cómo trabajáis, no entrando en vuestros sistemas. Si algo
                de eso llega igualmente, se devuelve sin abrirlo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
