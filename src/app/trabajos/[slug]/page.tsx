import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { trabajos } from "@/content/trabajos";
import { WorkImage } from "@/components/ui/WorkImage";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Boton } from "@/components/ui/Boton";

export const dynamicParams = false;

export function generateStaticParams() {
  return trabajos.map((trabajo) => ({ slug: trabajo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trabajo = trabajos.find((t) => t.slug === slug);
  if (!trabajo) return {};
  return {
    title: `${trabajo.cliente} — Subcon Works`,
    description: trabajo.solucion,
    robots: { index: false, follow: false },
  };
}

export default async function TrabajoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = trabajos.findIndex((t) => t.slug === slug);
  if (index === -1) notFound();

  const trabajo = trabajos[index];
  const siguiente = trabajos[(index + 1) % trabajos.length];

  return (
    <article className="pt-32 md:pt-40">
      <header className="container-max mb-12">
        <Link href="/#trabajos" className="link-underline font-mono-label text-xs">
          ← Volver a trabajos
        </Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-label mb-3">{trabajo.sector}</p>
            <h1 className="text-4xl font-medium text-text-primary md:text-7xl">{trabajo.cliente}</h1>
          </div>
          <span className="font-mono-label text-sm">{trabajo.año}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {trabajo.etiquetas.map((etiqueta) => (
            <Etiqueta key={etiqueta}>{etiqueta}</Etiqueta>
          ))}
        </div>
      </header>

      <div className="container-max relative mb-24 aspect-[16/9] overflow-hidden rounded-2xl">
        <WorkImage
          src={trabajo.imagenPortada}
          alt={`Vista principal del sitio de ${trabajo.cliente}`}
          fill
          priority
          sizes="(min-width: 1440px) 1440px, 92vw"
          className="object-cover"
        />
      </div>

      <div className="container-max mb-24 grid gap-12 md:grid-cols-2">
        <div>
          <p className="font-mono-label mb-4">El problema</p>
          <p className="text-lg text-text-muted">{trabajo.problema}</p>
        </div>
        <div>
          <p className="font-mono-label mb-4">Lo que hicimos</p>
          <p className="text-lg text-text-muted">{trabajo.solucion}</p>
        </div>
      </div>

      {trabajo.capturas.length > 0 && (
        <div className="container-max mb-24 grid gap-6 md:grid-cols-2">
          {trabajo.capturas.map((captura) => (
            <div key={captura} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <WorkImage
                src={captura}
                alt={`Captura adicional del sitio de ${trabajo.cliente}`}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="container-max mb-24 flex flex-wrap items-center gap-4">
        {trabajo.enlaceReal ? (
          <Boton href={trabajo.enlaceReal} target="_blank" rel="noopener noreferrer">
            Ver sitio real
          </Boton>
        ) : (
          <p className="font-mono-label text-xs">Enlace al sitio real — pendiente de añadir</p>
        )}
      </div>

      <Link
        href={`/trabajos/${siguiente.slug}/`}
        className="group block border-t border-line py-16"
      >
        <div className="container-max flex items-center justify-between gap-6">
          <div>
            <p className="font-mono-label mb-3">Siguiente caso</p>
            <p className="text-3xl font-medium text-text-primary md:text-5xl">{siguiente.cliente}</p>
          </div>
          <span className="link-underline font-mono-label text-sm">Ver →</span>
        </div>
      </Link>
    </article>
  );
}
