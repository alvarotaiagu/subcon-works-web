"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RE_REVISION_SOBRIA } from "@/lib/scriptCabeza";
import { cn } from "@/lib/utils";

/** La URL lleva `revision` (con valor o sin él): se enseña el mando (§3.16). */
const RE_REVISION = /[?&]revision(=|&|$)/;
const CLASE = "densidad-sobria";

/**
 * La query con `revision` cambiado y todo lo demás tal cual (los parámetros del
 * diagnóstico, 001 §3.5, van sin volver a codificar: por eso a mano y no con
 * `URLSearchParams`, que reescribiría `tel,wa` como `tel%2Cwa`).
 */
function conRevision(search: string, sobria: boolean): string {
  const nuevo = sobria ? "revision=sobria" : "revision";
  let puesto = false;
  const partes = search
    .replace(/^\?/, "")
    .split("&")
    .filter(Boolean)
    .flatMap((p) => {
      if (!/^revision(=|$)/.test(p)) return [p];
      if (puesto) return [];
      puesto = true;
      return [nuevo];
    });
  if (!puesto) partes.unshift(nuevo);
  return `?${partes.join("&")}`;
}

/**
 * Mando de maqueta (spec 002 §3.16). Solo existe si la URL lleva `?revision`: el enlace
 * que recibe el cliente sale limpio y el mando es para la reunión.
 *
 * - «Por debajo» (la cargada) y «Sobria», con `aria-pressed`. Cambian `densidad-sobria`
 *   en `<html>`; el bloque de CSS está en `estilos/sobria.css`. No son dos webs.
 * - La elección va en la URL (`history.replaceState`, conservando los demás parámetros y
 *   el `#hash`), nunca en `localStorage`: así no hay que tocar el aviso de cookies.
 * - Sin parpadeo al cargar: la clase ya la pone el script del `<head>` (PD-8); aquí solo
 *   se lee.
 * - Vale por página: los enlaces internos no arrastran `?revision`, así que al navegar
 *   sin recargar se vuelve a mirar la URL nueva y la clase se quita si ya no toca.
 */
export function Mando() {
  const ruta = usePathname();
  const [estado, setEstado] = useState<{ visible: boolean; sobria: boolean }>({
    visible: false,
    sobria: false,
  });

  useEffect(() => {
    const sobria = RE_REVISION_SOBRIA.test(location.search);
    document.documentElement.classList.toggle(CLASE, sobria);
    // La URL solo se conoce en el cliente (export estático): el mando nace oculto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado({ visible: RE_REVISION.test(location.search), sobria });
  }, [ruta]);

  if (!estado.visible) return null;

  const elegir = (sobria: boolean) => {
    document.documentElement.classList.toggle(CLASE, sobria);
    const url = `${location.pathname}${conRevision(location.search, sobria)}${location.hash}`;
    // Con el estado que ya tenía la entrada: el router de Next guarda el suyo ahí.
    history.replaceState(history.state, "", url);
    setEstado({ visible: true, sobria });
  };

  return (
    <div data-mando="" role="group" aria-label="Dos versiones de la misma web" className="mando">
      <span className="mando-rotulo" aria-hidden="true">
        Versión
      </span>
      {(
        [
          ["Por debajo", false],
          ["Sobria", true],
        ] as const
      ).map(([nombre, sobria]) => (
        <button
          key={nombre}
          type="button"
          aria-pressed={estado.sobria === sobria}
          onClick={() => elegir(sobria)}
          className={cn("mando-boton", estado.sobria === sobria && "es-activo")}
        >
          {nombre}
        </button>
      ))}
    </div>
  );
}
