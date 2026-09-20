import type { Metadata } from "next";
import Link from "next/link";
import { FormularioAuditoria } from "@/components/auditoria/FormularioAuditoria";
import { TOTAL_PREGUNTAS } from "@/content/auditoria";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Auditoría gratuita — ${site.nombre}`,
  description:
    "Cuéntanos cómo trabajáis en diez minutos y te devolvemos un informe con las horas que se van cada semana, lo que cuestan y qué se arregla primero.",
  robots: { index: false, follow: false },
};

export default function AuditoriaPage() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="container-max mb-16 md:mb-24">
        <Link href="/#auditoria" className="link-underline font-mono-label text-xs">
          ← Volver
        </Link>
        <p className="font-mono-label mb-4 mt-8">Auditoría gratuita</p>
        <h1 className="max-w-3xl text-4xl font-medium text-text-primary md:text-7xl">
          Cómo trabajáis por dentro
        </h1>
        <p className="mt-8 max-w-xl text-lg text-text-muted">
          {TOTAL_PREGUNTAS} preguntas sobre el día a día del negocio. Se contesta en unos diez
          minutos, con tus palabras, y no hace falta que sepas nada de tecnología.
        </p>

        <ul className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              titulo: "No contestes lo que no sepas",
              texto: "Déjalo en blanco. El informe marca los huecos en vez de inventárselos.",
            },
            {
              titulo: "Los números a ojo valen",
              texto: "«Unas 30 llamadas a la semana» sirve. No busques nada en ningún sitio.",
            },
            {
              titulo: "Puedes parar y seguir",
              texto:
                "Lo que escribas se guarda en este navegador. Cierra la pestaña y vuelve cuando quieras.",
            },
          ].map((nota) => (
            <li key={nota.titulo} className="border-t border-line pt-4">
              <p className="text-sm font-medium text-text-primary">{nota.titulo}</p>
              <p className="mt-1.5 text-sm text-text-muted">{nota.texto}</p>
            </li>
          ))}
        </ul>
      </header>

      <div className="container-max pb-[var(--space-section)]">
        <FormularioAuditoria />
      </div>
    </div>
  );
}
