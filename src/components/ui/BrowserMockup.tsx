import { WorkImage } from "@/components/ui/WorkImage";

/**
 * Marco de navegador para las capturas del catálogo.
 *
 * Si se le pasa `url` se pinta en la barra, y debe ser **la dirección real** de
 * la demo: los negocios de las plantillas son inventados, pero el sitio existe
 * y se puede abrir, así que no se le inventa además un dominio que parezca de
 * un negocio real.
 */
export function BrowserMockup({
  src,
  alt,
  url,
  priority = false,
}: {
  src: string;
  alt: string;
  url?: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-conducto bg-estrato transition-colors duration-500 group-hover:border-superficie/40">
      <div className="flex items-center gap-1.5 border-b border-conducto px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-apagado-abajo/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-apagado-abajo/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-apagado-abajo/40" />
        {url && (
          <span className="font-mono-label ml-3 truncate text-[9px] normal-case tracking-normal">
            {url}
          </span>
        )}
      </div>
      <div className="relative aspect-[3/2] overflow-hidden">
        <WorkImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 480px, 90vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
