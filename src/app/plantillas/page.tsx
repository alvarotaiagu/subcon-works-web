import type { Metadata } from "next";
import { Boton } from "@/components/ui/Boton";
import { CabeceraInterior, nitidezInterior } from "@/components/ui/CabeceraInterior";
import { Titular } from "@/components/ui/Titular";
import { CatalogoPlantillas } from "@/components/plantillas/CatalogoPlantillas";
import { correoSector } from "@/components/plantillas/PideTuSector";
import { plantillas } from "@/content/plantillas";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Webs de ejemplo por sector — ${site.nombre}`,
  description: `Las ${plantillas.length} plantillas por sector que hemos publicado, cada una con su demo entera visitable. Los negocios son inventados: enseñan lo que construimos y no son clientes.`,
  robots: { index: false, follow: false },
};

export default function PlantillasPage() {
  return (
    <section style={nitidezInterior("plantillas")}>
      <CabeceraInterior
        pagina="plantillas"
        arriba={`${plantillas.length} plantillas,`}
        em="cada una con una idea distinta."
        volver={{ href: "/#plantillas" }}
        titularClassName="max-w-6xl"
        className="mb-14"
      >
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-lg text-apagado-abajo">
            Ninguna es la anterior con otro color: cambian la estructura, la paleta, la tipografía y
            lo que se mueve. Pincha en cualquiera y se abre la demo entera, con su scroll y sus
            animaciones.
          </p>
          <div data-aviso-inventadas="" className="border-l-2 border-superficie/50 pl-5">
            <p className="font-mono-label mb-2 text-[10px] text-superficie">Aviso</p>
            <p className="text-base text-apagado-abajo">
              Todos los negocios que aparecen son <strong className="font-medium text-hueso">inventados</strong>:
              nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar
              cómo queda una web terminada, con todo su contenido en vez de «Lorem ipsum».
            </p>
          </div>
        </div>
      </CabeceraInterior>

      <div className="container-max pb-[var(--space-section)]">
        <CatalogoPlantillas />

        <div className="mt-24 border-t border-conducto pt-14">
          <Titular nivel={2} arriba="¿Alguna se parece a lo tuyo?" className="max-w-xl" />
          <p className="mt-5 max-w-xl text-apagado-abajo">
            Se adapta con tus datos, tus fotos y tu marca. Y si lo tuyo no está en la lista, te
            enseñamos la que más se acerca o preparamos una nueva para tu sector.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Boton href="/auditoria/">Pedir una propuesta</Boton>
            <Boton href={correoSector} variante="secundario">
              Pedir la de mi sector
            </Boton>
          </div>
        </div>
      </div>
    </section>
  );
}
