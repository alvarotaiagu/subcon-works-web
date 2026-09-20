/**
 * El cuestionario "Cómo trabajáis por dentro", en la versión web.
 *
 * Es literalmente el formulario del kit `03-kit-auditoria-negocio`
 * (`formulario/formulario-cliente.md`): las mismas 36 preguntas, la misma
 * numeración P1–P36 y los mismos siete bloques.
 *
 * **No renumerar.** El informe que genera el kit cita las respuestas por su
 * número: si aquí se cambia la numeración, las citas del informe apuntan a otra
 * pregunta. Se pueden quitar preguntas dejando los números que queden, nunca
 * recolocarlos.
 */

export interface Pregunta {
  /** "P1".."P36" — la clave con la que viaja a Supabase y al kit. */
  id: string;
  etiqueta: string;
  /** Texto de apoyo bajo la etiqueta: el ejemplo del formulario original. */
  ayuda?: string;
  /** `corta` pinta un input de una línea; el resto, un textarea. */
  tipo: "corta" | "larga";
}

export interface BloqueAuditoria {
  numero: number;
  titulo: string;
  /** Aparece arriba del bloque, antes de la primera pregunta. */
  entradilla?: string;
  preguntas: Pregunta[];
}

export const bloques: BloqueAuditoria[] = [
  {
    numero: 1,
    titulo: "El negocio",
    preguntas: [
      { id: "P1", etiqueta: "Nombre del negocio", tipo: "corta" },
      { id: "P2", etiqueta: "A qué os dedicáis, en una frase", tipo: "corta" },
      { id: "P3", etiqueta: "Ciudad", tipo: "corta" },
      {
        id: "P4",
        etiqueta: "¿Cuántas personas trabajáis y qué hace cada una?",
        ayuda:
          "Por ejemplo: «3: yo atiendo y hago presupuestos, mi socio produce, y una persona a media jornada en recepción».",
        tipo: "larga",
      },
      { id: "P5", etiqueta: "Horario de atención al público", tipo: "corta" },
      {
        id: "P6",
        etiqueta: "¿A cuántos clientes atendéis a la semana, más o menos?",
        tipo: "corta",
      },
    ],
  },
  {
    numero: 2,
    titulo: "Cómo os llegan los clientes",
    preguntas: [
      {
        id: "P7",
        etiqueta: "¿Por dónde os contactan?",
        ayuda:
          "Ordénalo de más a menos: teléfono, WhatsApp, Instagram, formulario de la web, email, gente que entra por la puerta, otros.",
        tipo: "larga",
      },
      {
        id: "P8",
        etiqueta: "¿Quién responde a esas llamadas y mensajes, y desde qué dispositivo?",
        ayuda:
          "Por ejemplo: «la recepcionista, desde su móvil personal» o «un móvil de empresa que está en el mostrador».",
        tipo: "larga",
      },
      { id: "P9", etiqueta: "¿Cuánto se tarda normalmente en contestar un mensaje?", tipo: "corta" },
      {
        id: "P10",
        etiqueta:
          "¿Qué pasa con las llamadas y mensajes que llegan fuera de horario o cuando estáis ocupados?",
        ayuda: "¿Sabéis cuántos se quedan sin contestar?",
        tipo: "larga",
      },
      {
        id: "P11",
        etiqueta: "¿Cuántas consultas de clientes nuevos entran a la semana, más o menos?",
        tipo: "corta",
      },
    ],
  },
  {
    numero: 3,
    titulo: "Agenda y citas",
    entradilla:
      "Si en tu negocio no se trabaja con cita previa, salta este bloque entero: escribe «no trabajamos con cita» en la primera y sigue.",
    preguntas: [
      {
        id: "P12",
        etiqueta: "¿Dónde apuntáis las citas?",
        ayuda: "Agenda de papel, Excel, Google Calendar, un programa concreto: dime cuál.",
        tipo: "larga",
      },
      {
        id: "P13",
        etiqueta: "¿Quién las apunta, y desde dónde se puede consultar la agenda?",
        tipo: "larga",
      },
      { id: "P14", etiqueta: "¿Puede el cliente reservar él solo por internet, sin llamar?", tipo: "corta" },
      {
        id: "P15",
        etiqueta: "¿Cómo le recordáis la cita al cliente?",
        ayuda: "¿Quién lo hace, y cuánto tiempo se le va a la semana en eso?",
        tipo: "larga",
      },
      {
        id: "P16",
        etiqueta:
          "¿Cuántas citas se pierden porque el cliente no aparece o cancela a última hora?",
        ayuda: "¿Cuánto factura de media una cita?",
        tipo: "larga",
      },
    ],
  },
  {
    numero: 4,
    titulo: "Presupuestos, cobro y facturación",
    preguntas: [
      {
        id: "P17",
        etiqueta: "¿Cómo preparáis un presupuesto y cómo se lo hacéis llegar al cliente?",
        tipo: "larga",
      },
      {
        id: "P18",
        etiqueta: "¿Cuántos presupuestos mandáis al mes, y cuántos acaban en trabajo?",
        tipo: "corta",
      },
      {
        id: "P19",
        etiqueta: "¿Cómo cobráis?",
        ayuda: "Efectivo, tarjeta, transferencia, pago por internet, financiación…",
        tipo: "larga",
      },
      {
        id: "P20",
        etiqueta: "¿Quién hace las facturas y con qué programa?",
        ayuda: "¿Cuánto tiempo al mes os lleva?",
        tipo: "larga",
      },
      {
        id: "P21",
        etiqueta: "¿Tenéis impagos, o pagos pendientes que se os olvida reclamar?",
        tipo: "larga",
      },
    ],
  },
  {
    numero: 5,
    titulo: "Después de la venta",
    preguntas: [
      {
        id: "P22",
        etiqueta: "Cuando un cliente termina, ¿qué pasa? ¿Volvéis a hablar con él?",
        tipo: "larga",
      },
      {
        id: "P23",
        etiqueta: "¿Pedís reseñas? Si sí, ¿cómo?",
        ayuda: "¿Cuántas tenéis ahora mismo y con qué nota?",
        tipo: "larga",
      },
      {
        id: "P24",
        etiqueta:
          "¿Vuestros clientes deberían volver cada cierto tiempo (revisión, mantenimiento, retoque, renovación)?",
        ayuda: "¿Cómo les avisáis de que les toca?",
        tipo: "larga",
      },
      {
        id: "P25",
        etiqueta:
          "¿Mandáis alguna comunicación cada cierto tiempo (novedades, ofertas, recordatorios)?",
        ayuda: "¿Con qué herramienta?",
        tipo: "larga",
      },
    ],
  },
  {
    numero: 6,
    titulo: "Herramientas y datos",
    preguntas: [
      {
        id: "P26",
        etiqueta: "Lista de programas y aplicaciones que pagáis",
        ayuda: "De cada uno: nombre, para qué lo usáis y cuánto cuesta al mes, si lo sabes.",
        tipo: "larga",
      },
      {
        id: "P27",
        etiqueta: "¿Dónde está la información de vuestros clientes?",
        ayuda:
          "Un programa, un Excel, la agenda de papel, el móvil de alguien, varias cosas a la vez.",
        tipo: "larga",
      },
      {
        id: "P28",
        etiqueta: "¿Hay copia de seguridad de eso? ¿Quién la hace y cada cuánto?",
        tipo: "larga",
      },
      {
        id: "P29",
        etiqueta: "¿Quién tiene acceso a esa información?",
        ayuda:
          "Y una pregunta incómoda: si mañana esa persona no viene, ¿el negocio puede seguir funcionando?",
        tipo: "larga",
      },
      {
        id: "P30",
        etiqueta: "¿Qué números miráis cada mes para saber si el negocio va bien?",
        tipo: "larga",
      },
    ],
  },
  {
    numero: 7,
    titulo: "Tiempo, IA y objetivos",
    preguntas: [
      {
        id: "P31",
        etiqueta: "Las 3 tareas repetitivas que más tiempo os comen",
        ayuda: "De cada una, dime cuánto tiempo a la semana, aunque sea a ojo.",
        tipo: "larga",
      },
      {
        id: "P32",
        etiqueta:
          "¿Cuánto cuesta más o menos una hora de trabajo de la persona que hace esas tareas?",
        ayuda:
          "Con lo que le cuesta a la empresa, aproximado. Si prefieres no decirlo, no pasa nada.",
        tipo: "corta",
      },
      {
        id: "P33",
        etiqueta: "¿Habéis probado alguna herramienta de inteligencia artificial o de automatización?",
        ayuda: "¿Qué pasó?",
        tipo: "larga",
      },
      {
        id: "P34",
        etiqueta: "¿Qué os preocuparía de usar inteligencia artificial con vuestros clientes?",
        tipo: "larga",
      },
      {
        id: "P35",
        etiqueta: "Si pudieras arreglar una sola cosa del día a día, ¿cuál sería?",
        tipo: "larga",
      },
      {
        id: "P36",
        etiqueta: "¿Qué presupuesto tienes en mente para montarlo? ¿Y para el mantenimiento mensual?",
        tipo: "larga",
      },
    ],
  },
];

export const TOTAL_PREGUNTAS = bloques.reduce((n, b) => n + b.preguntas.length, 0);

/** Lo que el informe lleva dentro. Se pinta en la sección de la portada. */
export const loQueRecibes = [
  {
    titulo: "Tu web, puntuada",
    texto:
      "Once dimensiones con la prueba delante: qué carga lento, qué no se ve en el móvil, qué te está costando posiciones en Google y qué falla de accesibilidad.",
  },
  {
    titulo: "Las horas que se van",
    texto:
      "Lo que tú nos cuentas, convertido en horas a la semana y en euros al año. Con el cálculo a la vista para que puedas discutirlo.",
  },
  {
    titulo: "Qué automatizar primero",
    texto:
      "Ocho áreas puntuadas y una lista ordenada por lo que más compensa, no por lo que más nos gustaría vender.",
  },
  {
    titulo: "Lo que no sabemos",
    texto:
      "Lo que dejes en blanco sale marcado como «sin datos». Un informe con huecos sinceros vale más que uno relleno de suposiciones.",
  },
];

/** Lo que nunca se pide. Es una promesa, y va escrita en el formulario. */
export const loQueNoPedimos = [
  "Datos de tus clientes: listados, fichas, historiales, nombres con teléfonos.",
  "Contraseñas, claves ni accesos a tus programas.",
  "Facturas, contabilidad ni exportaciones de tus bases de datos.",
];
