import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Botones (spec 002 §3.4). Las clases viven en globals.css (`.boton…`, en
 * `@layer components`, así cualquier utilidad de Tailwind las puede pisar).
 *
 * - `primario`: fondo del color del texto de su zona (`--hueso` abajo, `--tinta`
 *   arriba) y una línea de 2 px debajo (`--superficie` en oscuro, `--tinta` en claro).
 *   Hover: pasa a secundario (fondo transparente, borde y texto de su color).
 * - `secundario`: solo borde de 1,5 px del color del texto; en hover se rellena.
 * - `fondo`: dónde va el botón, `"oscuro"` (por defecto) o `"claro"` (sobre cal).
 * - `lineaApagada`: la línea descansa en `--conducto` y se enciende en lima con la
 *   clase `es-encendida` (solo el botón del Fondo, §3.11).
 *
 * Nunca lleva lima de relleno ni efecto magnético. Sin `href` es un `<button>`.
 */
export type VarianteBoton = "primario" | "secundario";
export type FondoBoton = "claro" | "oscuro";

interface OpcionesBoton {
  variante?: VarianteBoton;
  fondo?: FondoBoton;
  lineaApagada?: boolean;
}

/** Las clases de `Boton`, para lo que no puede ser el componente (el skip-link). */
export function clasesBoton({ variante = "primario", fondo = "oscuro", lineaApagada = false }: OpcionesBoton = {}) {
  return cn(
    "boton",
    variante === "primario" ? "boton-primario" : "boton-secundario",
    fondo === "claro" && "boton-claro",
    lineaApagada && "boton-linea-apagada",
  );
}

type PropsEnlace = OpcionesBoton & Omit<React.ComponentPropsWithoutRef<"a">, keyof OpcionesBoton> & { href: string };
type PropsBoton = OpcionesBoton &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof OpcionesBoton> & { href?: undefined };

export function Boton(props: PropsEnlace | PropsBoton) {
  if (props.href !== undefined) {
    const { variante, fondo, lineaApagada, className, href, ...resto } = props;
    const clases = cn(clasesBoton({ variante, fondo, lineaApagada }), className);
    // Las rutas internas van por next/link: si no, el salto es una recarga completa y
    // no hay transición de página (PageTransition se dispara con el cambio de pathname).
    if (href.startsWith("/")) return <Link href={href} className={clases} {...resto} />;
    return <a href={href} className={clases} {...resto} />;
  }
  const { variante, fondo, lineaApagada, className, type = "button", ...resto } = props;
  return <button type={type} className={cn(clasesBoton({ variante, fondo, lineaApagada }), className)} {...resto} />;
}
