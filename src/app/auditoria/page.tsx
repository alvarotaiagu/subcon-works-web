import type { Metadata } from "next";
import { CabeceraInterior, nitidezInterior } from "@/components/ui/CabeceraInterior";
import { FormularioAuditoria } from "@/components/auditoria/FormularioAuditoria";
import { TOTAL_PREGUNTAS } from "@/content/auditoria";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Auditoría de tu negocio — ${site.nombre}`,
  description:
    "Cuéntanos cómo trabajáis, con tus palabras, y te mandamos por correo un informe de tu negocio. La auditoría no se cobra.",
  robots: { index: false, follow: false },
};

export default function AuditoriaPage() {
  return (
    <div style={nitidezInterior("auditoria")}>
      <CabeceraInterior
        pagina="auditoria"
        arriba="Cómo trabajáis"
        em="por dentro"
        volver={{ href: "/#contacto" }}
        className="mb-16 md:mb-24"
      >
        <p className="mt-8 max-w-xl text-lg text-apagado-abajo">
          {TOTAL_PREGUNTAS} preguntas sobre el día a día del negocio. Se contestan con tus
          palabras, y no hace falta que sepas nada de tecnología. La auditoría no se cobra.
        </p>

        <ul className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              titulo: "No contestes lo que no sepas",
              texto: "Déjalo en blanco. Solo hacen falta el nombre del negocio, el tuyo y tu correo.",
            },
            {
              titulo: "Los números a ojo valen",
              texto: "Por ejemplo, «unas 30 llamadas a la semana» sirve. No busques nada en ningún sitio.",
            },
            {
              titulo: "Puedes parar y seguir",
              texto:
                "Lo que escribas se guarda en este navegador hasta que lo envías. Cierra la pestaña y vuelve cuando quieras.",
            },
          ].map((nota) => (
            <li key={nota.titulo} className="border-t border-conducto pt-4">
              <p className="text-sm font-medium text-hueso">{nota.titulo}</p>
              <p className="mt-1.5 text-sm text-apagado-abajo">{nota.texto}</p>
            </li>
          ))}
        </ul>
      </CabeceraInterior>

      <div className="container-max pb-[var(--space-section)]">
        <FormularioAuditoria />
      </div>
    </div>
  );
}
