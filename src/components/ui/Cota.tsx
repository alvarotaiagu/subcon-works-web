import { cn } from "@/lib/utils";

/**
 * La cota de una sección (spec 002 §3.5): etiqueta en Kode Mono mayúscula, siempre
 * sobre fondo oscuro. En reposo `--apagado-abajo`; alcanzada por el conducto (clase
 * `es-alcanzada`, la pone el hilo), `--superficie`. Sin opacidad (§3.1, regla 4).
 *
 * Lleva `data-numeracion` (spec 003, plan PD-5): es numeración de estructura, no una cifra
 * del texto (CA-8). También cubre el «404» de la cota de la página 404.
 *
 * Es también el ancla `data-hilo` del conducto (§3.10). En el menú móvil va sin ella
 * (`hilo={false}`): el hilo es de la portada.
 */
export function Cota({
  children,
  className,
  alcanzada = false,
  hilo = true,
}: {
  children: React.ReactNode;
  className?: string;
  alcanzada?: boolean;
  hilo?: boolean;
}) {
  return (
    <span
      data-hilo={hilo ? "" : undefined}
      data-numeracion=""
      className={cn("cota", alcanzada && "es-alcanzada", className)}
    >
      {children}
    </span>
  );
}
