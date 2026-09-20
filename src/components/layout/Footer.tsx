"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { plantillas } from "@/content/plantillas";

function useLocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: site.zonaHoraria,
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function Footer() {
  const time = useLocalClock();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-sunken">
      <div className="container-max grid gap-10 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <p className="font-mono-label mb-4 text-xs">{site.nombre}</p>
          <p className="max-w-sm text-text-muted">{site.descripcion}</p>
          <Link
            href="/auditoria/"
            className="mt-7 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg-base transition-colors hover:bg-accent-dim"
          >
            Auditoría gratis
          </Link>
        </div>

        <div>
          <p className="font-mono-label mb-4 text-xs">Contacto</p>
          <ul className="space-y-2 text-text-muted">
            <li>
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </li>
            <li>{site.ubicacion}</li>
          </ul>

          <p className="font-mono-label mb-4 mt-8 text-xs">Secciones</p>
          <ul className="space-y-2 text-text-muted">
            <li>
              <Link href="/plantillas/" className="link-underline">
                Las {plantillas.length} plantillas
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
          <p className="font-mono-label text-text-primary" suppressHydrationWarning>
            {time ?? "--:--:--"}
          </p>
          {site.redes.length > 0 && (
            <ul className="mt-6 space-y-2 text-text-muted">
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

      <div className="container-max flex flex-col gap-2 border-t border-line py-6 text-xs text-text-faint md:flex-row md:items-center md:justify-between">
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
