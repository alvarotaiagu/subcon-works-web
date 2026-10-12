import type { Metadata } from "next";
import { Boton } from "@/components/ui/Boton";
import { CabeceraInterior, nitidezInterior } from "@/components/ui/CabeceraInterior";
import { Titular } from "@/components/ui/Titular";
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
    <div style={nitidezInterior("estudio")}>
      <CabeceraInterior
        pagina="estudio"
        arriba="Quién hace"
        em="esto."
        volver={{ href: "/#equipo" }}
        className="mb-20"
      >
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-lg text-apagado-abajo">{entradaEstudio}</p>
          <p className="text-lg text-apagado-abajo">
            Somos un estudio pequeño a propósito: cada encargo lo llevan las mismas dos personas de
            principio a fin.
          </p>
        </div>
      </CabeceraInterior>

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
          <Titular nivel={2} id="como-trabajamos" arriba="Cómo trabajamos." className="max-w-2xl" />
          <PuntosNumerados
            puntos={comoTrabajamos}
            className="sm:grid-cols-2"
            textoClassName="max-w-md"
          />
        </section>

        <Compromisos className="mt-32" />

        <div className="mt-24 border-t border-conducto pt-14">
          <Titular nivel={2} arriba="¿Hablamos de tu negocio?" className="max-w-xl" />
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
