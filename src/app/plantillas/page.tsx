import type { Metadata } from "next";
import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { CatalogoPlantillas } from "@/components/plantillas/CatalogoPlantillas";
import { plantillas } from "@/content/plantillas";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Plantillas — ${site.nombre}`,
  description: `Las ${plantillas.length} bases por sector del taller, publicadas y abiertas. Negocios ficticios: son escaparates de lo que se construye, no clientes.`,
  robots: { index: false, follow: false },
};

export default function PlantillasPage() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="container-max mb-14">
        <Link href="/#plantillas" className="link-underline font-mono-label text-xs">
          <Glifo nombre="izquierda" /> Volver
        </Link>
        <p className="font-mono-label mb-4 mt-8">Catálogo</p>
        <h1 className="max-w-3xl text-4xl font-medium text-hueso md:text-7xl">
          {plantillas.length} plantillas, cada una con una idea distinta.
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-lg text-apagado-abajo">
            Ninguna es la anterior con otro color: cambian la estructura, la paleta, la tipografía y
            lo que se mueve. Pincha en cualquiera y se abre la demo entera, con su scroll y sus
            animaciones.
          </p>
          <div className="border-l-2 border-superficie/50 pl-5">
            <p className="font-mono-label mb-2 text-[10px] text-superficie">Aviso</p>
            <p className="text-sm text-apagado-abajo">
              Todos los negocios que aparecen son <strong className="font-medium text-hueso">inventados</strong>:
              nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar
              cómo queda una web terminada, con contenido de verdad en vez de «Lorem ipsum».
            </p>
          </div>
        </div>
      </header>

      <div className="container-max pb-[var(--space-section)]">
        <CatalogoPlantillas />

        <div className="mt-24 border-t border-conducto pt-14">
          <h2 className="max-w-xl text-3xl font-medium text-hueso md:text-5xl">
            ¿Alguna se parece a lo tuyo?
          </h2>
          <p className="mt-5 max-w-xl text-apagado-abajo">
            Se adapta con tus datos, tus fotos y tu marca, y está en línea en dos semanas. Y si lo
            tuyo no está en la lista, se construye una nueva: el catálogo empezó igual.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/auditoria/"
              className="rounded-full bg-hueso px-7 py-3.5 text-sm font-medium text-hondo transition-colors hover:bg-apagado-abajo"
            >
              Pedir la auditoría gratuita
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-apagado-abajo px-7 py-3.5 text-sm font-medium text-hueso transition-colors hover:border-superficie hover:text-superficie"
            >
              Escribir un correo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
