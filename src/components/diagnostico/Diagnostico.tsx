"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { esSector, opcionesPara, preguntasPara, respuestaValida } from "@/lib/diagnostico";
import type { ClaveRespuesta, Contexto, Respuestas, Sector } from "@/content/diagnostico";
import { irAAncla } from "@/lib/irAAncla";
import { withBasePath } from "@/lib/utils";
import { PasoPregunta } from "./PasoPregunta";
import { Resultado } from "./Resultado";

/**
 * Deja solo lo que vale para ese sector y lo ya respondido: al cambiar de
 * sector (portada) se caen las opciones `soloEn` del anterior, y al pasar a
 * `reserva=sin-cita` se cae `dolor=agenda`. Va en orden de preguntas, para
 * que `dolor` se valide con la `reserva` ya limpia.
 *
 * Aquí y no en `lib/diagnostico.ts` porque ese fichero lo estaba tocando otra
 * tarea (T04/T05) a la vez; puede subir allí más adelante.
 */
function limpiar(sector: Sector | undefined, respuestas: Respuestas): Respuestas {
  const limpias: Respuestas = {};
  for (const { clave } of preguntasPara(sector, "sector")) {
    const valor = respuestas[clave as ClaveRespuesta];
    if (valor === undefined) continue;
    if (clave === "canales") {
      const validos = new Set(opcionesPara(clave, sector, limpias).map((o) => o.codigo));
      const quedan = Array.isArray(valor) ? valor.filter((c) => validos.has(c)) : [];
      if (quedan.length > 0) limpias.canales = quedan;
    } else if (respuestaValida(clave, valor, sector, limpias)) {
      (limpias as Record<string, unknown>)[clave] = valor;
    }
  }
  return limpias;
}

/**
 * Diagnóstico rápido (spec 001, §3.2): una pregunta por pantalla y, al
 * terminar, el resultado en el mismo sitio.
 *
 * En la portada pregunta el sector; en una página de sector lo fija la
 * página. Lo prerrenderizado es siempre la primera pregunta. Sin JS solo
 * queda el `<noscript>` con el enlace a la auditoría (§3.9).
 *
 * Nada de `data-reveal` aquí dentro: el contenido cambia (pregunta ↔
 * resultado) y `useReveal` lo dejaría oculto.
 */
export function Diagnostico({
  contexto,
  sector,
  hayPlantillas = false,
}: {
  contexto: Contexto;
  /** Obligatorio con `contexto="sector"`; en la portada se ignora. */
  sector?: Sector;
  hayPlantillas?: boolean;
}) {
  const [elegido, setElegido] = useState<Sector | undefined>(undefined);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [paso, setPaso] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  // El foco solo se mueve cuando la persona cambia de pregunta, nunca al
  // cargar la página: robaría el foco y haría saltar el scroll.
  const movidoRef = useRef(false);

  const sectorActivo = contexto === "sector" ? sector : elegido;
  const preguntas = useMemo(() => preguntasPara(sectorActivo, contexto), [sectorActivo, contexto]);
  const total = preguntas.length;
  const pregunta = preguntas[Math.min(paso, total - 1)];

  useEffect(() => {
    if (!movidoRef.current) return;
    const titulo = tituloRef.current;
    if (!titulo) return;
    titulo.focus({ preventScroll: true });
    // Si el título nuevo ha quedado por encima de la vista (opciones largas en
    // móvil), se sube al principio del componente. Con Lenis, por Lenis.
    if (titulo.getBoundingClientRect().top < 0) irAAncla(contenedorRef.current);
  }, [paso, terminado]);

  const avanzar = () => {
    movidoRef.current = true;
    if (paso < total - 1) setPaso(paso + 1);
    else setTerminado(true);
  };

  const atras = () => {
    movidoRef.current = true;
    setPaso((p) => Math.max(0, p - 1));
  };

  const elegir = (codigo: string) => {
    if (pregunta.clave === "s") {
      if (!esSector(codigo)) return;
      setElegido(codigo);
      setRespuestas((r) => limpiar(codigo, r));
    } else {
      const clave = pregunta.clave;
      setRespuestas((r) => limpiar(sectorActivo, { ...r, [clave]: codigo }));
    }
    avanzar();
  };

  const marcar = (codigo: string) => {
    const opciones = opcionesPara("canales", sectorActivo, respuestas);
    setRespuestas((r) => {
      const antes = new Set(r.canales ?? []);
      if (antes.has(codigo)) antes.delete(codigo);
      else antes.add(codigo);
      // En el orden de la pregunta, no en el de marcado.
      const canales = opciones.map((o) => o.codigo).filter((c) => antes.has(c));
      return limpiar(sectorActivo, { ...r, canales });
    });
  };

  const seguir = () => {
    if ((respuestas.canales ?? []).length > 0) avanzar();
  };

  const valor = pregunta.clave === "s" ? elegido : respuestas[pregunta.clave];

  return (
    <div ref={contenedorRef} className="scroll-mt-28">
      {terminado ? (
        <Resultado
          sector={sectorActivo ?? "otro"}
          respuestas={respuestas}
          contexto={contexto}
          hayPlantillas={hayPlantillas}
          tituloRef={tituloRef}
        />
      ) : (
        <PasoPregunta
          key={pregunta.clave}
          pregunta={pregunta}
          opciones={opcionesPara(pregunta.clave, sectorActivo, respuestas)}
          numero={paso + 1}
          total={total}
          valor={valor}
          tituloRef={tituloRef}
          onElegir={elegir}
          onMarcar={marcar}
          onSeguir={seguir}
          onAtras={paso > 0 ? atras : undefined}
        />
      )}

      <noscript>
        <p className="mt-8 max-w-xl text-text-muted">
          El diagnóstico rápido necesita JavaScript para ir pregunta a pregunta. Si lo tienes
          desactivado, puedes pedirnos directamente la{" "}
          <a href={withBasePath("/auditoria/")} className="link-underline text-text-primary">
            auditoría gratuita
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
