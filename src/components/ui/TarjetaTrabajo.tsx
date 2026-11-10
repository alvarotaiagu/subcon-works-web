import { WorkImage } from "@/components/ui/WorkImage";
import { etiquetaTipo, type Trabajo } from "@/content/trabajos";
import { partirConcepto } from "@/lib/concepto";
import { cn } from "@/lib/utils";

/**
 * Un trabajo (spec 002 §3.8, la tarjeta del corte). La tarjeta entera es el enlace a la
 * web viva. Arriba, la portada; luego la línea de superficie; debajo, en `--hondo`, el
 * negocio, «tipo · sector · ciudad», el nombre del concepto en Kode Mono lima y, al pasar
 * el ratón o al enfocar, lo que se mueve.
 *
 * El origen se dice siempre en la segunda línea: «Encargo» o «Estudio propio». Un estudio
 * propio es un negocio inventado y la tarjeta no lo disimula.
 */
export function TarjetaTrabajo({
  trabajo,
  className,
  priority = false,
}: {
  trabajo: Trabajo;
  className?: string;
  priority?: boolean;
}) {
  const { nombre } = partirConcepto(trabajo.concepto);
  const origen = trabajo.estado ? `${etiquetaTipo[trabajo.tipo]} · ${trabajo.estado}` : etiquetaTipo[trabajo.tipo];

  return (
    <a
      href={trabajo.url}
      target="_blank"
      rel="noopener"
      data-foco-dentro
      className={cn("tarjeta-corte", className)}
    >
      <span className="tarjeta-corte-sup">
        <WorkImage
          src={`/trabajos/${trabajo.imagen}.jpg`}
          alt={`Portada de ${trabajo.negocio}, ${trabajo.sector.toLowerCase()}`}
          width={1200}
          height={800}
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 90vw"
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />
        <span className="tarjeta-corte-mov">{trabajo.movimiento}</span>
      </span>
      <span className="tarjeta-corte-linea" aria-hidden="true" />
      <span className="tarjeta-corte-inf">
        <span className="tarjeta-corte-origen" data-tipo={trabajo.tipo}>
          {origen}
        </span>
        <span className="tarjeta-corte-negocio">{trabajo.negocio}</span>
        <span className="tarjeta-corte-sector">
          {trabajo.sector} · {trabajo.ciudad}
        </span>
        {nombre && <span className="tarjeta-corte-concepto">«{nombre}»</span>}
      </span>
    </a>
  );
}
