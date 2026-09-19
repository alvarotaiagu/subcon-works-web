"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

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
        </div>

        <div>
          <p className="font-mono-label mb-4 text-xs">Contacto</p>
          <ul className="space-y-2 text-text-muted">
            <li>
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </li>
            <li>{site.telefono}</li>
            <li>{site.ubicacion}</li>
          </ul>
        </div>

        <div>
          <p className="font-mono-label mb-4 text-xs">Hora local</p>
          <p className="font-mono-label text-text-primary" suppressHydrationWarning>
            {time ?? "--:--:--"}
          </p>
          <ul className="mt-6 space-y-2 text-text-muted">
            {site.redes.map((red) => (
              <li key={red.label}>
                <a href={red.href} className="link-underline">
                  {red.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-max flex flex-col gap-2 border-t border-line py-6 text-xs text-text-faint md:flex-row md:items-center md:justify-between">
        <span>
          © {year} {site.nombre}. Todos los derechos reservados.
        </span>
        <span>Diseñado y construido por {site.nombre}.</span>
      </div>
    </footer>
  );
}
