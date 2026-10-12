import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Diagnostico } from "@/components/diagnostico/Diagnostico";
import { sectores } from "@/content/sectores";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";

/**
 * «−4 · Diagnóstico» de la portada (spec 001 §3.7, 002 §3.5): el diagnóstico rápido con
 * la pregunta del sector y, debajo, la fila «Por sector». El menú no cambia
 * (D-005).
 */
export function DiagnosticoRapido() {
  return (
    <Seccion
      id="diagnostico"
      etiqueta="Diagnóstico rápido · un minuto"
      aria-labelledby="diagnostico-titulo"
      className="scroll-mt-28 py-[var(--space-section)]"
    >
      <div className="container-max">
        <Titular
          nivel={2}
          id="diagnostico-titulo"
          arriba="Qué le haríamos a tu negocio, antes de hablar con nadie."
          className="max-w-3xl"
        />
        <p className="mt-8 max-w-xl text-lg text-apagado-abajo">
          Unas preguntas de un toque sobre cómo trabajáis y, al acabar, las mejoras que más sentido
          tienen para vosotros. No se envía ni se guarda nada.
        </p>

        <div className="mt-14">
          <Diagnostico contexto="portada" />
        </div>

        <nav aria-label="Por sector" className="mt-16 border-t border-conducto pt-8">
          <p className="font-mono-label mb-4 text-[10px]">Por sector</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {sectores.map((pagina) => (
              <li key={pagina.slug}>
                <Link
                  href={`/sectores/${pagina.slug}/`}
                  className="link-underline text-hueso"
                  data-cursor-hover
                >
                  {pagina.nombre}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sectores/" className="link-underline text-apagado-abajo" data-cursor-hover>
                Todos los sectores <Glifo nombre="derecha" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Seccion>
  );
}
