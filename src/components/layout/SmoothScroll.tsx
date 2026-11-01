"use client";

import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { irAAncla } from "@/lib/irAAncla";

/**
 * Los enlaces a un ancla de la página en la que ya se está (`#contacto`, `/#servicios`
 * desde la portada) saltan aquí, con `irAAncla`, y no con el navegador ni con next/link:
 *
 * - Si Lenis está a media animación (se acaba de mover la rueda), el salto del router
 *   cambia el `#` pero Lenis sigue con su animación y lo pisa: el enlace «no hace nada».
 *   `lenis.scrollTo` la sustituye.
 * - Si el `#` ya es ese (en `/#contacto`, subir y volver a pulsar «Contacto»), next/link
 *   ve la misma URL y no se mueve.
 *
 * Va en captura en `document`: corre antes que el `onClick` de next/link, que ve
 * `defaultPrevented` y no navega. Los `onClick` propios (cerrar el menú móvil) siguen
 * corriendo; por eso el salto espera un fotograma, a que el menú se haya cerrado.
 * Los enlaces con `data-ancla-nativa` (el «Saltar al contenido») siguen siendo nativos:
 * el navegador les mueve también el foco.
 */
function useAnclasMismaPagina() {
  useEffect(() => {
    const alPulsar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const enlace = (e.target as HTMLElement).closest?.<HTMLAnchorElement>("a[href]");
      if (!enlace || enlace.target === "_blank" || enlace.hasAttribute("data-ancla-nativa")) return;
      const destino = new URL(enlace.href, window.location.href);
      if (
        !destino.hash ||
        destino.origin !== window.location.origin ||
        destino.pathname !== window.location.pathname ||
        destino.search !== window.location.search
      )
        return;
      let id: string;
      try {
        id = decodeURIComponent(destino.hash.slice(1));
      } catch {
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (destino.hash !== window.location.hash) window.history.pushState(null, "", destino.hash);
      requestAnimationFrame(() => irAAncla(el));
    };
    document.addEventListener("click", alPulsar, true);
    return () => document.removeEventListener("click", alPulsar, true);
  }, []);
}

/** Monta el smooth scroll global y los saltos a anclas de la misma página. No renderiza nada. */
export function SmoothScroll() {
  useLenis();
  useAnclasMismaPagina();
  return null;
}
