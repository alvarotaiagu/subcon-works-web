import type { Metadata } from "next";
import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Boton } from "@/components/ui/Boton";
import { Compromisos } from "@/components/sections/Compromisos";
import { PuntosNumerados } from "@/components/ui/PuntosNumerados";
import { TarjetaPersona } from "@/components/ui/TarjetaPersona";
import { comoTrabajamos, entradaEstudio, personas } from "@/content/estudio";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Estudio — ${site.nombre}`,
  description:
    "Quién hace Undertactics, cómo trabajamos y qué queda a nombre de cada negocio: el código, el dominio y las claves.",
  robots: { index: false, follow: false },
};

export default function EstudioPage() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="container-max mb-20">
        <Link href="/#equipo" className="link-underline font-mono-label text-xs">
          <Glifo nombre="izquierda" /> Volver
        </Link>
        <p className="font-mono-label mb-4 mt-8">Estudio</p>
        <h1 className="max-w-3xl text-4xl font-medium text-hueso md:text-7xl">
          Quién hace esto.
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-lg text-apagado-abajo">{entradaEstudio}</p>
          <p className="text-lg text-apagado-abajo">
            Somos un estudio pequeño a propósito: cada encargo lo llevan las mismas dos personas de
            principio a fin.
          </p>
        </div>
      </header>

      <div className="container-max pb-[var(--space-section)]">
        <div className="border-t border-conducto pt-14">
          <div className="grid max-w-4xl gap-16 md:grid-cols-2 md:gap-10">
            {personas.map((persona) => (
              <TarjetaPersona
                key={persona.nombre}
                persona={persona}
                nivel="h2"
                sizes="(min-width: 768px) 440px, 18rem"
              />
            ))}
          </div>
        </div>

        <section aria-labelledby="como-trabajamos" className="mt-32 border-t border-conducto pt-14">
          <h2
            id="como-trabajamos"
            className="max-w-2xl text-3xl font-medium text-hueso md:text-5xl"
          >
            Cómo trabajamos.
          </h2>
          <PuntosNumerados
            puntos={comoTrabajamos}
            className="sm:grid-cols-2"
            textoClassName="max-w-md"
          />
        </section>

        <Compromisos className="mt-32" />

        <div className="mt-24 border-t border-conducto pt-14">
          <h2 className="max-w-xl text-3xl font-medium text-hueso md:text-5xl">
            ¿Hablamos de tu negocio?
          </h2>
          <p className="mt-5 max-w-xl text-apagado-abajo">
            Empieza por la auditoría gratuita: diez minutos de formulario y te decimos qué falta antes
            de hablar de precio.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Boton href="/auditoria/">Pedir la auditoría gratuita</Boton>
            <Boton href={`mailto:${site.email}`} variante="secundario">
              Escribir un correo
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}
