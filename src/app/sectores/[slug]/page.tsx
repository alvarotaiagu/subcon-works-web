import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Diagnostico } from "@/components/diagnostico/Diagnostico";
import { CabeceraSector } from "@/components/sectores/CabeceraSector";
import { ChatEjemplo } from "@/components/sectores/ChatEjemplo";
import { MejorasSector } from "@/components/sectores/MejorasSector";
import { PlantillasSector, plantillasValidas } from "@/components/sectores/PlantillasSector";
import { ProblemasSector } from "@/components/sectores/ProblemasSector";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { sectores, sectorPorSlug } from "@/content/sectores";

// Export estático: solo existen los tres slugs de D-009. Cualquier otro es la
// 404 de la web (spec §3.5, §6).
export const dynamicParams = false;

export function generateStaticParams() {
  return sectores.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pagina = sectorPorSlug(slug);
  if (!pagina) return { robots: { index: false, follow: false } };
  return {
    title: pagina.metadatos.title,
    description: pagina.metadatos.description,
    robots: { index: false, follow: false },
  };
}

/** Una página de sector (spec §3.8): los siete bloques, en orden. */
export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const pagina = sectorPorSlug(slug);
  if (!pagina) notFound();

  const plantillas = plantillasValidas(pagina.plantillas);
  const hayPlantillas = plantillas.length > 0;
  const bloque = "container-max pb-[var(--space-section)]";

  return (
    <div className="pt-32 md:pt-40">
      {/* 1 · Cabecera */}
      <CabeceraSector pagina={pagina} />

      {/* 2 · Problemas del sector */}
      <ProblemasSector problemas={pagina.problemas} className={bloque} />

      {/* 3 · Lo que haríamos */}
      <MejorasSector
        ids={pagina.mejoras}
        sector={pagina.codigo}
        hayPlantillas={hayPlantillas}
        className={bloque}
      />

      {/* 4 · Diagnóstico, con el sector fijado */}
      <section
        id="diagnostico"
        aria-labelledby="diagnostico-titulo"
        className="scroll-mt-28 border-y border-conducto bg-roca"
      >
        <div className="container-max py-[var(--space-section)]">
          <p className="font-mono-label mb-4">Diagnóstico rápido · un minuto</p>
          <h2
            id="diagnostico-titulo"
            className="max-w-2xl text-3xl font-medium text-hueso md:text-5xl"
          >
            Lo primero que haríamos en tu caso.
          </h2>
          <p className="mt-6 max-w-xl text-apagado-abajo">
            Unas preguntas de un toque sobre cómo trabajáis y, al acabar, las mejoras que más
            sentido tienen para vosotros. No se envía ni se guarda nada.
          </p>
          <div className="mt-12">
            <Diagnostico contexto="sector" sector={pagina.codigo} hayPlantillas={hayPlantillas} />
          </div>
        </div>
      </section>

      {/* 5 · Asistente: ejemplo fijo de un negocio inventado */}
      <section id="asistente" aria-label="Ejemplo del asistente" className="container-max scroll-mt-28 py-[var(--space-section)]">
        <ChatEjemplo
          conversacion={pagina.conversacion}
          ejemploDe={pagina.ejemplo.de}
          negocio={pagina.ejemplo.negocio}
        />
      </section>

      {/* 6 · Plantillas: no sale si no hay ninguna válida (D-007) */}
      <PlantillasSector plantillas={plantillas} className={`${bloque} scroll-mt-28`} />

      {/* 7 · Cierre */}
      <CtaFinal />
    </div>
  );
}
