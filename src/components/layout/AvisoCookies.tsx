"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CLAVE = "subcon:aviso-cookies:v1";

/**
 * Aviso de almacenamiento local.
 *
 * Esta web no pone cookies de seguimiento ni analítica: lo único que guarda es
 * el borrador del formulario de auditoría y el hecho de haber visto este aviso,
 * y las dos cosas se quedan en el navegador. El aviso está igualmente porque es
 * la norma de la casa en todos los sitios, y porque el visitante tiene derecho
 * a saber que se le está escribiendo algo en su navegador.
 *
 * Ojo con el CSS: aquí la visibilidad se decide en JavaScript (no se monta el
 * nodo hasta que hace falta) en vez de con `[hidden]`, precisamente para no
 * repetir el fallo clásico de que un `display:flex` en la clase le gane al
 * atributo `hidden` y el botón "no haga nada".
 */
export function AvisoCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // El prerender no puede saber si ya se aceptó: se decide aquí, en
      // cliente, y por eso el aviso nace oculto y aparece con su animación.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(CLAVE)) setVisible(true);
    } catch {
      // Almacenamiento bloqueado: no se puede recordar la respuesta, así que
      // tampoco se molesta con el aviso en cada carga.
    }
  }, []);

  if (!visible) return null;

  const aceptar = () => {
    try {
      localStorage.setItem(CLAVE, new Date().toISOString());
    } catch {
      /* sin almacenamiento, el aviso volverá: es lo correcto */
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso sobre el almacenamiento en tu navegador"
      className="aviso-cookies fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-2xl rounded-2xl border border-line bg-bg-raised/95 p-5 shadow-2xl backdrop-blur-md md:inset-x-auto md:left-6 md:bottom-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <p className="text-sm text-text-muted">
          Esta web no usa cookies de seguimiento ni analítica. Solo guarda en tu navegador el
          borrador del formulario y que ya has visto este aviso.{" "}
          <Link href="/privacidad/" className="link-underline text-text-primary">
            Más detalle
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={aceptar}
          className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-bg-base transition-colors hover:bg-accent-dim"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
