"use client";

import { useId, type Ref } from "react";
import { cn } from "@/lib/utils";
import { Glifo } from "@/components/ui/Glifo";
import type { OpcionVista, PreguntaVista } from "@/lib/diagnostico";

/**
 * Una pregunta del diagnóstico rápido, sola en pantalla (spec §3.2).
 *
 * Las de una opción avanzan al tocar; las de varias llevan «Seguir», que se
 * activa con al menos una marcada. Las opciones son botones con
 * `aria-pressed`: se llega a todas con el tabulador y se marcan con Intro o
 * espacio.
 */
export function PasoPregunta({
  pregunta,
  opciones,
  numero,
  total,
  valor,
  tituloRef,
  onElegir,
  onMarcar,
  onSeguir,
  onAtras,
}: {
  pregunta: PreguntaVista;
  /** Las de `opcionesPara`: ya sin las `soloEn` de otro sector ni `agenda` con `sin-cita`. */
  opciones: OpcionVista[];
  /** 1, 2, 3… */
  numero: number;
  total: number;
  /** Lo marcado: un código en las de una opción, una lista en las de varias. */
  valor: string | string[] | undefined;
  tituloRef: Ref<HTMLHeadingElement>;
  onElegir: (codigo: string) => void;
  onMarcar: (codigo: string) => void;
  onSeguir: () => void;
  /** Sin él, no hay «Atrás» (primera pregunta). */
  onAtras?: () => void;
}) {
  const id = useId();
  const idTitulo = `${id}-titulo`;
  const idAyuda = `${id}-ayuda`;
  const varias = pregunta.tipo === "varias";
  const marcados = Array.isArray(valor) ? valor : typeof valor === "string" ? [valor] : [];
  const puedeSeguir = varias && marcados.length > 0;

  return (
    <div>
      <Progreso numero={numero} total={total} />

      <h3
        ref={tituloRef}
        id={idTitulo}
        tabIndex={-1}
        className="mt-10 max-w-3xl text-2xl font-medium text-hueso outline-none md:text-4xl"
      >
        {pregunta.titulo}
      </h3>
      {pregunta.ayuda && (
        <p id={idAyuda} className="mt-3 text-apagado-abajo">
          {pregunta.ayuda}
        </p>
      )}

      <div
        role="group"
        aria-labelledby={idTitulo}
        aria-describedby={pregunta.ayuda ? idAyuda : undefined}
        className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2"
      >
        {opciones.map((opcion) => (
          <BotonOpcion
            key={opcion.codigo}
            opcion={opcion}
            marcada={marcados.includes(opcion.codigo)}
            varias={varias}
            onClick={() => (varias ? onMarcar(opcion.codigo) : onElegir(opcion.codigo))}
          />
        ))}
      </div>

      {(onAtras || varias) && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {onAtras && (
            <button
              type="button"
              onClick={onAtras}
              className="rounded-full border border-apagado-abajo px-6 py-3 text-sm font-medium text-hueso transition-colors hover:border-superficie hover:text-superficie"
              data-cursor-hover
            >
              <Glifo nombre="izquierda" /> Atrás
            </button>
          )}
          {varias && (
            <button
              type="button"
              onClick={onSeguir}
              disabled={!puedeSeguir}
              className="rounded-full bg-hueso px-7 py-3.5 text-sm font-medium text-hondo transition-colors hover:bg-apagado-abajo disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-hueso"
              data-cursor-hover
            >
              Seguir <Glifo nombre="derecha" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** «Pregunta 2 de 7» y la barra: el mismo dibujo que el Progreso de la auditoría. */
function Progreso({ numero, total }: { numero: number; total: number }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono-label text-[10px]">
        Pregunta {numero} de {total}
      </p>
      <div
        className="mt-3 h-px w-full bg-conducto"
        role="progressbar"
        aria-label="Progreso del diagnóstico"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={numero}
        aria-valuetext={`Pregunta ${numero} de ${total}`}
      >
        <div
          className="h-px origin-left bg-superficie transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${Math.max(numero / total, 0.02)})` }}
        />
      </div>
    </div>
  );
}

function BotonOpcion({
  opcion,
  marcada,
  varias,
  onClick,
}: {
  opcion: OpcionVista;
  marcada: boolean;
  varias: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={marcada}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors",
        marcada
          ? "border-hueso bg-hueso text-hondo shadow-[0_2px_0_var(--superficie)]"
          : "border-apagado-abajo text-apagado-abajo hover:border-hueso hover:text-hueso"
      )}
      data-cursor-hover
    >
      {/* Casilla en las de varias, punto en las de una: se ve de un vistazo
          si se puede marcar más de una. */}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
          varias ? "rounded-[4px]" : "rounded-full",
          marcada ? "border-hondo bg-hondo" : "border-apagado-abajo"
        )}
      >
        {marcada && (
          <span className={cn("bg-hueso", varias ? "h-1.5 w-1.5 rounded-[1px]" : "h-1.5 w-1.5 rounded-full")} />
        )}
      </span>
      <span>{opcion.etiqueta}</span>
    </button>
  );
}
