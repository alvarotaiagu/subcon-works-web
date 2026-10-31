"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Boton } from "@/components/ui/Boton";
import { contacto } from "@/content/consultora";
import { site } from "@/content/site";
import { enviarSolicitud } from "@/lib/auditoriaApi";

/**
 * El formulario corto de la portada «consultora». Envía por la misma función de Supabase
 * que la auditoría (`enviarSolicitud`), sin tocar el backend: el nombre de la empresa va
 * a `negocio`, el tipo de negocio a `sector` y las dos respuestas libres a P2 («a qué os
 * dedicáis») y P35 («qué arreglarías»), con una marca al final para que el informe del
 * kit sepa que vienen del formulario corto (como D-010 con el diagnóstico). El backend
 * exige un correo, así que el correo es obligatorio y el teléfono opcional.
 */

interface Datos {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  tipo: string;
  mejorar: string;
  consentimiento: boolean;
}

const VACIO: Datos = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  tipo: "",
  mejorar: "",
  consentimiento: false,
};

type Fallos = Partial<Record<keyof Datos, string>>;

const MARCA = " (formulario corto de la portada)";

function validar(d: Datos): Fallos {
  const f: Fallos = {};
  if (d.nombre.trim().length < 2) f.nombre = "Dinos cómo te llamas.";
  if (d.empresa.trim().length < 2) f.empresa = "Dinos cómo se llama tu empresa o negocio.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim())) {
    f.email = "Revisa el correo: es donde te vamos a contestar.";
  }
  if (!d.tipo) f.tipo = "Elige el tipo de negocio que más se parezca al tuyo.";
  if (d.mejorar.trim().length < 5) f.mejorar = "Cuéntanos, aunque sea en una frase, qué te gustaría mejorar.";
  if (!d.consentimiento) f.consentimiento = "Hace falta que lo aceptes para poder escribirte.";
  return f;
}

const MENSAJES: Record<string, string> = {
  ritmo: "Has enviado varias solicitudes seguidas. Espera un minuto y vuelve a probar.",
  red: "No hemos podido conectar. Revisa tu conexión y vuelve a probar.",
  servidor: "Algo ha fallado de nuestra parte y tu solicitud no ha salido.",
  validacion: "Hay algún dato que no hemos podido aceptar. Revísalo y vuelve a probar.",
};

export function FormularioContacto() {
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [fallos, setFallos] = useState<Fallos>({});
  const [estado, setEstado] = useState<"reposo" | "enviando" | "enviado">("reposo");
  const [aviso, setAviso] = useState<string | null>(null);
  const trampa = useRef<HTMLInputElement>(null);

  const poner =
    <K extends keyof Datos>(clave: K) =>
    (valor: Datos[K]) => {
      setDatos((d) => ({ ...d, [clave]: valor }));
      if (fallos[clave]) setFallos((f) => ({ ...f, [clave]: undefined }));
    };

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    const nuevos = validar(datos);
    setFallos(nuevos);
    setAviso(null);
    const primero = Object.keys(nuevos)[0];
    if (primero) {
      document.getElementById(`contacto-${primero}`)?.focus();
      return;
    }

    setEstado("enviando");
    const res = await enviarSolicitud({
      negocio: datos.empresa.trim(),
      sector: datos.tipo,
      contacto_nombre: datos.nombre.trim(),
      contacto_email: datos.email.trim(),
      contacto_telefono: datos.telefono.trim() || undefined,
      consentimiento: true,
      respuestas: {
        P2: `${datos.tipo}${MARCA}`,
        P35: `${datos.mejorar.trim()}${MARCA}`,
      },
      direccion_fiscal: trampa.current?.value ?? "",
    });

    if (res.ok) {
      setEstado("enviado");
      return;
    }
    setEstado("reposo");
    setAviso(MENSAJES[res.motivo] ?? MENSAJES.servidor);
  }

  if (estado === "enviado") {
    return (
      <div className="contacto-hecho" role="status">
        <p className="font-mono-label text-[10px] text-superficie">Recibido</p>
        <h3>Gracias, {datos.nombre.trim().split(" ")[0]}.</h3>
        <p>
          Hemos recibido tu solicitud. Vamos a leerla con calma y te contestamos al correo que nos
          has dado, con lo que veamos y las dudas que nos queden.
        </p>
        <p>
          Mientras tanto, si quieres adelantar trabajo, la{" "}
          <Link href="/auditoria/" className="link-underline text-hueso">
            auditoría completa
          </Link>{" "}
          nos da el detalle de cómo trabajáis.
        </p>
      </div>
    );
  }

  return (
    <form className="contacto-form" onSubmit={enviar} noValidate>
      {/* Campo trampa: invisible y fuera del orden de tabulación; solo lo rellenan los robots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="contacto-direccion_fiscal">No rellenes este campo</label>
        <input
          ref={trampa}
          id="contacto-direccion_fiscal"
          name="direccion_fiscal"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="contacto-dos">
        <Campo id="nombre" etiqueta="Nombre" error={fallos.nombre}>
          <input
            id="contacto-nombre"
            className="campo"
            value={datos.nombre}
            onChange={(e) => poner("nombre")(e.target.value)}
            autoComplete="name"
            aria-invalid={fallos.nombre ? true : undefined}
            aria-describedby={fallos.nombre ? "contacto-nombre-error" : undefined}
            required
          />
        </Campo>
        <Campo id="empresa" etiqueta="Empresa" error={fallos.empresa}>
          <input
            id="contacto-empresa"
            className="campo"
            value={datos.empresa}
            onChange={(e) => poner("empresa")(e.target.value)}
            autoComplete="organization"
            aria-invalid={fallos.empresa ? true : undefined}
            aria-describedby={fallos.empresa ? "contacto-empresa-error" : undefined}
            required
          />
        </Campo>
      </div>

      <div className="contacto-dos">
        <Campo id="email" etiqueta="Email" error={fallos.email}>
          <input
            id="contacto-email"
            className="campo"
            type="email"
            value={datos.email}
            onChange={(e) => poner("email")(e.target.value)}
            autoComplete="email"
            aria-invalid={fallos.email ? true : undefined}
            aria-describedby={fallos.email ? "contacto-email-error" : undefined}
            required
          />
        </Campo>
        <Campo id="telefono" etiqueta="Teléfono" opcional>
          <input
            id="contacto-telefono"
            className="campo"
            type="tel"
            value={datos.telefono}
            onChange={(e) => poner("telefono")(e.target.value)}
            autoComplete="tel"
          />
        </Campo>
      </div>

      <Campo id="tipo" etiqueta="Tipo de negocio" error={fallos.tipo}>
        <select
          id="contacto-tipo"
          className="campo"
          value={datos.tipo}
          onChange={(e) => poner("tipo")(e.target.value)}
          aria-invalid={fallos.tipo ? true : undefined}
          aria-describedby={fallos.tipo ? "contacto-tipo-error" : undefined}
          required
        >
          <option value="">Elige uno…</option>
          {contacto.tipos.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="mejorar" etiqueta="¿Qué te gustaría mejorar?" error={fallos.mejorar}>
        <textarea
          id="contacto-mejorar"
          className="campo resize-y"
          rows={4}
          maxLength={4000}
          value={datos.mejorar}
          onChange={(e) => poner("mejorar")(e.target.value)}
          aria-invalid={fallos.mejorar ? true : undefined}
          aria-describedby={fallos.mejorar ? "contacto-mejorar-error" : undefined}
          required
        />
      </Campo>

      <div>
        <label className="contacto-consentimiento">
          <input
            id="contacto-consentimiento"
            type="checkbox"
            checked={datos.consentimiento}
            onChange={(e) => poner("consentimiento")(e.target.checked)}
            aria-invalid={fallos.consentimiento ? true : undefined}
            aria-describedby={fallos.consentimiento ? "contacto-consentimiento-error" : undefined}
          />
          <span>
            Acepto que Undertactics use estos datos para contestarme, según la{" "}
            <Link href="/privacidad/" className="link-underline text-hueso">
              política de privacidad
            </Link>
            .
          </span>
        </label>
        {fallos.consentimiento && (
          <p id="contacto-consentimiento-error" className="contacto-error">
            {fallos.consentimiento}
          </p>
        )}
      </div>

      <div className="contacto-envio">
        <Boton type="submit" lineaApagada data-hilo-fin="" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : contacto.cta}
        </Boton>
        <p className="text-sm text-apagado-abajo">Sin coste y sin compromiso.</p>
      </div>

      <p role="alert" className="contacto-aviso" hidden={!aviso}>
        {aviso}{" "}
        {aviso && (
          <>
            Si prefieres, escríbenos a{" "}
            <a href={`mailto:${site.email}`} className="link-underline text-hueso">
              {site.email}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}

function Campo({
  id,
  etiqueta,
  error,
  opcional = false,
  children,
}: {
  id: string;
  etiqueta: string;
  error?: string;
  opcional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="contacto-campo">
      <label htmlFor={`contacto-${id}`}>
        {etiqueta}
        {opcional && <span className="contacto-opcional"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`contacto-${id}-error`} className="contacto-error">
          {error}
        </p>
      )}
    </div>
  );
}
