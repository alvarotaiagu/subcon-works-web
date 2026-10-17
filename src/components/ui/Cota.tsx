import { cn } from "@/lib/utils";

/**
 * La cota de una sección (spec 002 §3.5): etiqueta en Kode Mono mayúscula, siempre
 * sobre fondo oscuro. En reposo `--apagado-abajo`; alcanzada por el conducto (clase
 * `es-alcanzada`, la pone el hilo), `--superficie`. Sin opacidad (§3.1, regla 4).
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
    <span data-hilo={hilo ? "" : undefined} className={cn("cota", alcanzada && "es-alcanzada", className)}>
      {children}
    </span>
  );
}
