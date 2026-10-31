import type { Metadata } from "next";
import { CabeceraInterior, nitidezInterior } from "@/components/ui/CabeceraInterior";
import { TarjetaSector } from "@/components/sectores/TarjetaSector";
import { sectores } from "@/content/sectores";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Por sector — ${site.nombre}`,
  description:
    "Clínicas dentales, alojamientos rurales, y asesorías y despachos: lo que se puede automatizar en cada uno, con su diagnóstico rápido y un ejemplo del asistente.",
  robots: { index: false, follow: false },
};

export default function SectoresPage() {
  return (
    <div style={nitidezInterior("sectores")}>
      <CabeceraInterior
        pagina="sectores"
        arriba="Lo que se puede automatizar"
        em="en tu sector."
        volver={{ href: "/#diagnostico" }}
        className="mb-14"
      >
        <p className="mt-8 max-w-xl text-lg text-apagado-abajo">
          Cada página habla de los problemas de ese tipo de negocio, trae el diagnóstico rápido con
          el sector ya elegido y enseña cómo contestaría su asistente.
        </p>
      </CabeceraInterior>

      <div className="container-max pb-[var(--space-section)]">
        <ul className="grid gap-4 md:grid-cols-3">
          {sectores.map((pagina) => (
            <li key={pagina.slug}>
              <TarjetaSector pagina={pagina} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
