import Link from "next/link";
import { Diagnostico } from "@/components/diagnostico/Diagnostico";
import { sectores } from "@/content/sectores";

/**
 * Sección «Diagnóstico» de la portada (spec §3.7): el diagnóstico rápido con
 * la pregunta del sector y, debajo, la fila «Por sector». El menú no cambia
 * (D-005).
 *
 * Sin `data-reveal`: el diagnóstico cambia de contenido (pregunta ↔
 * resultado) y `useReveal` lo dejaría oculto.
 */
export function DiagnosticoRapido() {
  return (
    <section
      id="diagnostico"
      aria-labelledby="diagnostico-titulo"
      className="scroll-mt-28 border-t border-line"
    >
      <div className="container-max py-[var(--space-section)]">
        <p className="font-mono-label mb-4">Diagnóstico rápido · un minuto</p>
        <h2
          id="diagnostico-titulo"
          className="max-w-3xl text-4xl font-medium text-text-primary md:text-6xl"
        >
          Qué le haríamos a tu negocio, antes de hablar con nadie.
        </h2>
        <p className="mt-8 max-w-xl text-lg text-text-muted">
          Unas preguntas de un toque sobre cómo trabajáis y, al acabar, las mejoras que más sentido
          tienen para vosotros. No se envía ni se guarda nada.
        </p>

        <div className="mt-14">
          <Diagnostico contexto="portada" />
        </div>

        <nav aria-label="Por sector" className="mt-16 border-t border-line pt-8">
          <p className="font-mono-label mb-4 text-[10px]">Por sector</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {sectores.map((pagina) => (
              <li key={pagina.slug}>
                <Link
                  href={`/sectores/${pagina.slug}/`}
                  className="link-underline text-text-primary"
                  data-cursor-hover
                >
                  {pagina.nombre}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sectores/" className="link-underline text-text-muted" data-cursor-hover>
                Todos los sectores →
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
