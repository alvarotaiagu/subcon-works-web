import type { Metadata } from "next";
import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
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
    <div className="pt-32 md:pt-40">
      <header className="container-max mb-14">
        <Link href="/#diagnostico" className="link-underline font-mono-label text-xs">
          <Glifo nombre="izquierda" /> Volver
        </Link>
        <p className="font-mono-label mb-4 mt-8">Por sector</p>
        <h1 className="max-w-3xl text-4xl font-medium text-hueso md:text-7xl">
          Lo que se puede automatizar en tu sector.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-apagado-abajo">
          Cada página habla de los problemas de ese tipo de negocio, trae el diagnóstico rápido con
          el sector ya elegido y enseña cómo contestaría su asistente.
        </p>
      </header>

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
