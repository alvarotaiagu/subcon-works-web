import type { CSSProperties } from "react";
import type { Maqueta } from "@/content/consultora";

/**
 * Los seis ejemplos de «Soluciones en acción», hechos con HTML y CSS (no son capturas de
 * nada que exista): una conversación, una factura leída, una nota de voz, un embudo, un
 * panel y una agenda. Todos los datos son inventados y el marco lo dice («Ejemplo»).
 * Cada uno es una imagen para el lector de pantalla (`role="img"` con su descripción) y
 * su interior va oculto: leer una tabla de mentira celda a celda no ayuda a nadie.
 *
 * `--d` es el orden de entrada de cada pieza (lo anima `consultora.css` cuando el bloque
 * pasa a `es-en-vista`).
 */

const d = (n: number) => ({ "--d": n }) as CSSProperties;

function Marco({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion: string;
  children: React.ReactNode;
}) {
  return (
    <div className="maqueta" role="img" aria-label={`Ejemplo: ${descripcion}`}>
      <div className="maqueta-barra" aria-hidden="true">
        <span className="maqueta-puntos">
          <i />
          <i />
          <i />
        </span>
        <span className="maqueta-titulo">{titulo}</span>
        <span className="maqueta-ejemplo">Ejemplo</span>
      </div>
      <div className="maqueta-cuerpo" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

function Chat() {
  return (
    <Marco
      titulo="WhatsApp · 23:40"
      descripcion="una clienta pregunta por un hueco el jueves y el agente le ofrece dos horas, reserva la que elige y crea la cita en la agenda."
    >
      <div className="mq-chat">
        <p className="mq-msg mq-cliente anim" style={d(0)}>
          ¿Tenéis hueco el jueves por la tarde?
        </p>
        <p className="mq-msg mq-agente anim" style={d(1)}>
          Sí: el jueves tengo libre a las 17:30 y a las 18:15. ¿Cuál te va mejor?
        </p>
        <p className="mq-msg mq-cliente anim" style={d(2)}>
          A las 17:30
        </p>
        <p className="mq-msg mq-agente anim" style={d(3)}>
          Reservado. Te escribo la víspera para recordártelo.
        </p>
        <p className="mq-estado anim" style={d(4)}>
          <i /> Cita creada en la agenda · jueves 17:30
        </p>
      </div>
    </Marco>
  );
}

function Factura() {
  return (
    <Marco
      titulo="Facturas · bandeja de entrada"
      descripcion="una factura en PDF de la que se extraen proveedor, fecha, base, IVA y total, y se clasifica como suministros pendiente de revisar."
    >
      <div className="mq-factura">
        <div className="mq-doc">
          <i className="mq-doc-linea mq-doc-fuerte" />
          <i className="mq-doc-linea anim mq-marca" style={d(0)} />
          <i className="mq-doc-linea" />
          <i className="mq-doc-linea mq-doc-corta" />
          <span className="mq-doc-hueco" />
          <i className="mq-doc-linea anim mq-marca" style={d(2)} />
          <i className="mq-doc-linea anim mq-marca mq-doc-corta" style={d(3)} />
        </div>
        <dl className="mq-campos">
          <div className="anim" style={d(1)}>
            <dt>Proveedor</dt>
            <dd>Suministros Ejemplo, S.L.</dd>
          </div>
          <div className="anim" style={d(2)}>
            <dt>Fecha</dt>
            <dd>14/03/2026</dd>
          </div>
          <div className="anim" style={d(3)}>
            <dt>Base · IVA 21 %</dt>
            <dd>100,00 € · 21,00 €</dd>
          </div>
          <div className="anim" style={d(4)}>
            <dt>Total</dt>
            <dd>121,00 €</dd>
          </div>
          <div className="anim" style={d(5)}>
            <dt>Categoría</dt>
            <dd>
              Suministros <b className="mq-pendiente">Pendiente de revisar</b>
            </dd>
          </div>
        </dl>
      </div>
    </Marco>
  );
}

function Voz() {
  const alturas = [30, 62, 40, 78, 52, 90, 36, 70, 48, 84, 28, 58, 44, 74, 34];
  return (
    <Marco
      titulo="Nota de voz"
      descripcion="un mensaje de voz de un autónomo se transcribe y se registra como una venta de 120 euros en efectivo."
    >
      <div className="mq-voz">
        <div className="mq-onda anim" style={d(0)}>
          {alturas.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="mq-trans anim" style={d(1)}>
          «Hoy, tres entradas, ciento veinte euros, en efectivo.»
        </p>
        <div className="mq-registro anim" style={d(2)}>
          <span>Venta</span>
          <span>3 uds.</span>
          <span>120,00 €</span>
          <span>Efectivo</span>
        </div>
        <p className="mq-trans mq-consulta anim" style={d(3)}>
          «¿Cuánto llevo vendido esta semana?» <b>→ lo lee de tu registro</b>
        </p>
      </div>
    </Marco>
  );
}

function Embudo() {
  const columnas: { t: string; fichas: string[] }[] = [
    { t: "Nuevo", fichas: ["Contacto web", "Llamada"] },
    { t: "Contactado", fichas: ["Pide visita"] },
    { t: "Propuesta", fichas: ["Presupuesto enviado"] },
    { t: "Cerrado", fichas: ["Firmado"] },
  ];
  return (
    <Marco
      titulo="Oportunidades"
      descripcion="un tablero con cuatro columnas, nuevo, contactado, propuesta y cerrado, y un seguimiento automático programado a los tres días."
    >
      <div className="mq-embudo">
        {columnas.map((c, i) => (
          <div key={c.t} className="mq-col">
            <p>{c.t}</p>
            {c.fichas.map((f, k) => (
              <span key={f} className="mq-ficha anim" style={d(i + k)}>
                {f}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mq-estado anim" style={d(5)}>
        <i /> Seguimiento automático · recordatorio a los 3 días sin respuesta
      </p>
    </Marco>
  );
}

function Panel() {
  const barras = [38, 52, 44, 66, 58, 74, 62];
  return (
    <Marco
      titulo="Panel de negocio"
      descripcion="un panel con ventas, gastos y clientes nuevos, un gráfico de barras de la semana y una lista de cosas por revisar."
    >
      <div className="mq-panel">
        <div className="mq-kpis">
          <p className="anim" style={d(0)}>
            <span>Ventas</span>
            <b>3.420 €</b>
          </p>
          <p className="anim" style={d(1)}>
            <span>Gastos</span>
            <b>1.180 €</b>
          </p>
          <p className="anim" style={d(2)}>
            <span>Clientes nuevos</span>
            <b>12</b>
          </p>
        </div>
        <div className="mq-barras anim" style={d(3)}>
          {barras.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <ul className="mq-lista anim" style={d(4)}>
          <li>2 facturas sin categoría</li>
          <li>1 cliente sin contactar</li>
        </ul>
      </div>
    </Marco>
  );
}

function Citas() {
  const dias = ["L", "M", "X", "J", "V"];
  // 0 libre · 1 ocupada · 2 solicitud nueva
  const huecos = [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 0, 0],
    [0, 2, 1, 0],
    [1, 0, 0, 1],
  ];
  return (
    <Marco
      titulo="Agenda · semana"
      descripcion="una agenda semanal con huecos libres y ocupados, una solicitud nueva el jueves y la confirmación con recordatorio enviada."
    >
      <div className="mq-citas">
        <div className="mq-semana">
          {dias.map((dia, i) => (
            <div key={dia} className="mq-dia">
              <p>{dia}</p>
              {huecos[i].map((h, k) => (
                <i
                  key={k}
                  className={h === 2 ? "mq-hueco mq-nueva anim" : h === 1 ? "mq-hueco mq-ocupada" : "mq-hueco"}
                  style={h === 2 ? d(1) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
        <ul className="mq-avisos">
          <li className="anim" style={d(2)}>
            <i /> Solicitud nueva · jueves, 2.º hueco
          </li>
          <li className="anim" style={d(3)}>
            <i /> Confirmada y recordatorio enviado
          </li>
        </ul>
      </div>
    </Marco>
  );
}

export function Maqueta({ tipo }: { tipo: Maqueta }) {
  switch (tipo) {
    case "whatsapp":
      return <Chat />;
    case "factura":
      return <Factura />;
    case "voz":
      return <Voz />;
    case "embudo":
      return <Embudo />;
    case "panel":
      return <Panel />;
    default:
      return <Citas />;
  }
}
