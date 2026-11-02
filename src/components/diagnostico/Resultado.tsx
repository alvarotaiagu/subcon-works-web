"use client";

import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import { codificar, diagnosticar, tituloResultado, urlCanonica } from "@/lib/diagnostico";
import type { MejoraDiagnosticada } from "@/lib/diagnostico";
import type { Contexto, Respuestas, Sector } from "@/content/diagnostico";
import { Boton } from "@/components/ui/Boton";
import { EnlaceMejora } from "./EnlaceMejora";
import { withBasePath } from "@/lib/utils";

/** Lo que pasa al pulsar «Copiar el enlace»: nada aún, copiado o a mano. */
type Copia = "nada" | "copiado" | "a-mano";

function seleccionar(campo: HTMLInputElement | null) {
  campo?.focus();
  campo?.select();
}

/**
 * El resultado del diagnóstico rápido (spec §3.3): de 3 a 5 mejoras con su
 * porqué, una sola línea de «cualquier agencia» y las tres acciones.
 *
 * Sin nota global ni precios (D-003). Sustituye a las preguntas en el mismo
 * sitio, así que tampoco lleva `data-reveal`.
 */
export function Resultado({
  sector,
  respuestas,
  contexto,
  hayPlantillas,
  tituloRef,
  onCambiar,
}: {
  sector: Sector;
  respuestas: Respuestas;
  contexto: Contexto;
  hayPlantillas: boolean;
  tituloRef: Ref<HTMLHeadingElement>;
  /** «Cambiar respuestas»: vuelve a la primera pregunta con todo marcado. */
  onCambiar: () => void;
}) {
  const mejoras = useMemo(
    () => diagnosticar(sector, respuestas, contexto, { hayPlantillas }),
    [sector, respuestas, contexto, hayPlantillas]
  );
  const query = codificar(sector, respuestas);

  const [copia, setCopia] = useState<Copia>("nada");
  const [url, setUrl] = useState("");
  const campoRef = useRef<HTMLInputElement>(null);

  const copiar = async () => {
    // La canónica, no `location.href`: un diagnóstico de la portada con
    // `s=dental` se comparte apuntando a la página dental (§3.5).
    const canonica = urlCanonica(sector, respuestas, window.location.origin, withBasePath(""));
    setUrl(canonica);
    // Se vacía el aviso antes de copiar: si no, un segundo «Enlace copiado»
    // no cambia el texto y el lector de pantalla no lo vuelve a anunciar.
    setCopia("nada");
    try {
      await navigator.clipboard.writeText(canonica);
      setCopia("copiado");
    } catch {
      // Sin permiso o sin contexto seguro: la URL a la vista, ya seleccionada.
      // La primera vez el campo aún no existe y lo selecciona el efecto de
      // abajo al montarse; en un segundo intento ya está y se selecciona aquí.
      setCopia("a-mano");
      seleccionar(campoRef.current);
    }
  };

  // Tras el commit, no en un `requestAnimationFrame`: si el portapapeles
  // rechaza después del `await`, React puede no haber pintado el campo aún.
  useEffect(() => {
    if (copia === "a-mano") seleccionar(campoRef.current);
  }, [copia]);

  return (
    <div>
      <p className="font-mono-label text-[10px]">Tu diagnóstico</p>
      <h3
        ref={tituloRef}
        tabIndex={-1}
        className="mt-4 max-w-3xl text-2xl font-medium text-hueso outline-none md:text-4xl"
      >
        {tituloResultado(sector)}
      </h3>

      <ol className="mt-10 max-w-3xl">
        {mejoras.map((mejora, i) => (
          <MejoraFila key={mejora.id} mejora={mejora} numero={i + 1} />
        ))}
      </ol>

      <p className="mt-8 max-w-3xl text-apagado-abajo">
        Esto lo podemos montar nosotros o cualquier agencia que sepa hacerlo.
      </p>

      <div className="mt-10 flex max-w-3xl flex-wrap items-center gap-4">
        <Boton href={`/auditoria/?${query}`}>
          Llevar estas respuestas a la auditoría
        </Boton>
        <Boton variante="secundario" onClick={copiar}>
          Copiar el enlace a este diagnóstico
        </Boton>
        <button
          type="button"
          onClick={onCambiar}
          className="rounded-full px-2 py-3 text-sm font-medium text-apagado-abajo transition-colors hover:text-hueso"
        >
          Cambiar respuestas
        </button>
      </div>

      {/* Siempre en el DOM para que el lector de pantalla anuncie el cambio. */}
      <p role="status" className="font-mono-label mt-4 min-h-[1em] text-[10px] text-superficie">
        {copia === "copiado" ? "Enlace copiado" : ""}
      </p>

      {copia === "a-mano" && (
        <div className="mt-2 max-w-3xl">
          <label htmlFor="diagnostico-url" className="text-sm text-apagado-abajo">
            No hemos podido copiarlo. Cópialo desde aquí:
          </label>
          <input
            ref={campoRef}
            id="diagnostico-url"
            type="text"
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full rounded-xl border border-apagado-abajo bg-estrato px-4 py-3 font-mono text-sm text-hueso"
          />
        </div>
      )}
    </div>
  );
}

function MejoraFila({ mejora, numero }: { mejora: MejoraDiagnosticada; numero: number }) {
  return (
    <li className="border-t border-conducto py-7 last:border-b">
      <div className="flex gap-6">
        <span className="font-mono-label w-8 shrink-0 pt-1 text-sm" data-numeracion="">
          {String(numero).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <p className="text-xl font-medium text-hueso md:text-2xl">{mejora.titulo}</p>
          <p className="mt-2 text-apagado-abajo">{mejora.queResuelve}</p>
          <p className="mt-3 text-sm italic text-apagado-abajo">{mejora.porque}</p>
          {mejora.enlace && <EnlaceMejora href={mejora.enlace} className="mt-4 inline-block" />}
        </div>
      </div>
    </li>
  );
}
