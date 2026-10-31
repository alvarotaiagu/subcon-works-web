"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { plantillas } from "@/content/plantillas";
import { Logo } from "@/components/ui/Logo";
import { Boton } from "@/components/ui/Boton";

/** Un solo formato para todas las vueltas del reloj. */
let formatoHora: Intl.DateTimeFormat | null = null;

function useLocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      formatoHora ??= new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: site.zonaHoraria,
      });
      setTime(formatoHora.format(new Date()));
    };
    // El primer formato arranca ICU (unos 35 ms con CPU ×4): en su propia tarea, no dentro
    // de la hidratación (spec 002 §3.15).
    const primera = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    return () => {
      clearTimeout(primera);
      clearInterval(id);
    };
  }, []);

  return time;
}

export function Footer() {
  const time = useLocalClock();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-conducto bg-roca">
      <div className="container-max grid gap-10 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <Logo className="mb-5 text-2xl" />
          <p className="max-w-sm text-apagado-abajo">{site.descripcion}</p>
          <Boton href="/#contacto" className="mt-7 px-6 py-3">
            Solicitar diagnóstico
          </Boton>
        </div>

        <div>
          <p className="font-mono-label mb-4 text-xs">Contacto</p>
          <ul className="space-y-2 text-apagado-abajo">
            <li>
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </li>
            <li>{site.ubicacion}</li>
          </ul>

          <p className="font-mono-label mb-4 mt-8 text-xs">Secciones</p>
          <ul className="space-y-2 text-apagado-abajo">
            <li>
              <Link href="/plantillas/" className="link-underline">
                Las {plantillas.length} plantillas
              </Link>
            </li>
            <li>
              <Link href="/estudio/" className="link-underline">
                Quién hace esto
              </Link>
            </li>
            <li>
              <Link href="/auditoria/" className="link-underline">
                Auditoría gratuita
              </Link>
            </li>
            <li>
              <Link href="/privacidad/" className="link-underline">
                Privacidad
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono-label mb-4 text-xs">Hora local</p>
          <p className="font-mono-label text-hueso" suppressHydrationWarning>
            {time ?? "--:--:--"}
          </p>
          {site.redes.length > 0 && (
            <ul className="mt-6 space-y-2 text-apagado-abajo">
              {site.redes.map((red) => (
                <li key={red.label}>
                  <a href={red.href} className="link-underline">
                    {red.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container-max flex flex-col gap-2 border-t border-conducto py-6 text-xs text-apagado-abajo md:flex-row md:items-center md:justify-between">
        <span>
          © {year} {site.nombre}. Todos los derechos reservados.
        </span>
        <span>
          Los negocios de las plantillas son ficticios. Diseñado y construido por {site.nombre}.
        </span>
      </div>
    </footer>
  );
}
