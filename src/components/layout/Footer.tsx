"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { plantillas } from "@/content/plantillas";
import { Logo } from "@/components/ui/Logo";

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
    <footer className="border-t border-conducto bg-roca">
      <div className="container-max grid gap-10 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <Logo className="mb-5 text-2xl" />
          <p className="max-w-sm text-apagado-abajo">{site.descripcion}</p>
          <Link
            href="/auditoria/"
            className="mt-7 inline-flex rounded-full bg-hueso px-6 py-3 text-sm font-medium text-hondo transition-colors hover:bg-apagado-abajo"
          >
            Auditoría gratis
          </Link>
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
