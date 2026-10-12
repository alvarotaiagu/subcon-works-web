"use client";

import { useEffect } from "react";
import { esperarCortina } from "@/components/layout/Preloader";
import { cortePortada } from "@/content/portada";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { irAAncla } from "@/lib/irAAncla";

/**
 * Llegar a la portada con un ancla del corte (`/#proceso`, `/#equipo`…), desde una
 * interior o recargando (spec 002 §3.5 y §6).
 *
 * El navegador (o el router) salta al ancla en cuanto hay HTML, pero después los pins de
 * Plantillas y Proceso meten su recorrido y las letras cambian los altos: lo de debajo
 * del primer pin se queda miles de píxeles más abajo. Aquí se repite el salto cuando ya
 * está todo medido: tras la cortina, las letras y un `ScrollTrigger.refresh()`, con
 * Lenis. Va el último en `page.tsx`, así sus efectos corren después de los de las
 * secciones (los pins ya están puestos).
 *
 * Un diagnóstico abierto por URL (`?v=…#diagnostico`) lo lleva `Diagnostico` (001 §3.5).
 */
export function AnclaPortada() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || id === "inicio" || !cortePortada.some((e) => e.id === id)) return;
    if (id === "diagnostico" && window.location.search) return;

    let vivo = true;
    void (async () => {
      await esperarCortina();
      await document.fonts.ready;
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      if (!vivo) return;
      registerGsap();
      ScrollTrigger.refresh();
      irAAncla(document.getElementById(id));
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return null;
}
