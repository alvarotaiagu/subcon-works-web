/**
 * El instrumento del hero (spec 002 §3.6): los cuatro objetos que ve el cliente, arriba,
 * y el pozo de cada uno, debajo, con tres paradas que son servicios reales.
 *
 * - `servicio`: el número del servicio en `servicios.ts`.
 * - `clave`: una palabra o expresión que aparece tal cual (sin distinguir mayúsculas ni
 *   tildes) en la `descripcion` o en un `incluye` de ese servicio. Lo comprueba
 *   `hero.test.ts`.
 * - `lectura`: el ejemplo que se lee bajo la superficie, en tramos. Entre tramo y tramo
 *   el hero pinta una flecha (`Glifo` «derecha»), salvo con `flechas: false` (una frase
 *   seguida, partida solo para que ningún trozo de texto sea mayor que el titular, que
 *   es el LCP, §3.6). Va siempre con el rótulo «Ejemplo»: los ejemplos no son clientes
 *   (D-019).
 *
 * Sin imports, para que los tests de Node lo carguen tal cual. Los textos entran en P-04.
 */

export interface Parada {
  servicio: string;
  texto: string;
  clave: string;
}

export interface Flujo {
  /** Rótulo del objeto, encima de la tarjeta. `rotuloCorto`: el de móvil (PD-10). */
  rotulo: string;
  rotuloCorto: string;
  lectura: readonly string[];
  flechas: boolean;
  paradas: readonly [Parada, Parada, Parada];
}

export const flujos: readonly Flujo[] = [
  {
    rotulo: "WhatsApp · 23:40",
    rotuloCorto: "WhatsApp",
    lectura: [
      "23:40 · «¿Tenéis hueco el jueves?»",
      "contesta el agente",
      "cita el jueves a las 17:30",
      "recordatorio la víspera.",
    ],
    flechas: true,
    paradas: [
      { servicio: "07", texto: "Agente contesta", clave: "WhatsApp" },
      { servicio: "06", texto: "Cita en tu agenda", clave: "citas" },
      { servicio: "06", texto: "Recordatorio la víspera", clave: "Recordatorios" },
    ],
  },
  {
    rotulo: "Tu tienda",
    rotuloCorto: "Tu tienda",
    lectura: ["Pago con Bizum", "factura emitida sola", "aviso de qué reponer."],
    flechas: true,
    paradas: [
      { servicio: "02", texto: "Cobro con tarjeta o Bizum", clave: "Bizum" },
      { servicio: "06", texto: "Factura emitida", clave: "facturas" },
      { servicio: "02", texto: "Aviso de qué reponer", clave: "reponer" },
    ],
  },
  {
    rotulo: "Google",
    rotuloCorto: "Google",
    lectura: ["Reseña de cinco estrellas", "respuesta con tu tono", "entra en el informe del mes."],
    flechas: true,
    paradas: [
      { servicio: "08", texto: "Respuesta a la reseña", clave: "reseña" },
      { servicio: "05", texto: "Ficha de Google al día", clave: "Ficha de Google" },
      { servicio: "06", texto: "Informe del mes", clave: "Informes" },
    ],
  },
  {
    rotulo: "Instagram",
    rotuloCorto: "Instagram",
    lectura: ["Lo que hay debajo de un reel:", "se graba en tu local,", "se monta con subtítulos", "y sale programado."],
    flechas: false,
    paradas: [
      { servicio: "09", texto: "Grabado en tu local", clave: "local" },
      { servicio: "09", texto: "Montaje y subtítulos", clave: "subtítulos" },
      { servicio: "09", texto: "Programado en el calendario", clave: "Calendario" },
    ],
  },
];
