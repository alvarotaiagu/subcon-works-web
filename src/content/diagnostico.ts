/**
 * Contenido del diagnóstico rápido (spec 001): preguntas, sectores, catálogo
 * de mejoras y reglas.
 *
 * Lo cargan también los tests de Node (`--experimental-strip-types`), así que
 * aquí no se importa nada con `@/`, no se lee `process.env` y no hay enums.
 *
 * **Los códigos no se cambian ni se reutilizan.** Viajan en la URL de los
 * diagnósticos ya mandados (spec §3.5). Si una opción deja de tener sentido, se
 * quita; su código no se da a otra cosa.
 *
 * Ningún texto lleva escrito cuántas preguntas hay: el total cambia según el
 * contexto (portada o página de sector) y lo calcula `preguntasPara`.
 */

/** Sector del negocio: el código de la pregunta `s`. */
export type Sector = "dental" | "rural" | "despachos" | "otro";

/** Clave de cada pregunta en la URL. */
export type Clave = "s" | "canales" | "reserva" | "fuera" | "web" | "resenas" | "dolor";

/** Las claves que se responden también en una página de sector (todas menos `s`). */
export type ClaveRespuesta = Exclude<Clave, "s">;

/** Dónde está el diagnóstico: la portada pregunta el sector; una página de sector, no. */
export type Contexto = "portada" | "sector";

/**
 * Lo respondido, por clave. El sector va aparte: en una página de sector lo
 * fija la página, y en la portada sale de la pregunta `s`.
 */
export interface Respuestas {
  canales?: string[];
  reserva?: string;
  fuera?: string;
  web?: string;
  resenas?: string;
  dolor?: string;
}

/**
 * Un texto que puede cambiar según el sector. `base` vale para `otro` y para
 * cualquier sector que no tenga el suyo.
 */
export interface Texto {
  base: string;
  dental?: string;
  rural?: string;
  despachos?: string;
}

export interface Opcion {
  /** Código corto y estable: es lo que viaja en la URL, nunca la posición. */
  codigo: string;
  etiqueta: Texto;
  /** Si existe, la opción solo sale en estos sectores. */
  soloEn?: Sector[];
}

export interface Pregunta {
  clave: Clave;
  /** `una` avanza al tocar; `varias` lleva el botón «Seguir». */
  tipo: "una" | "varias";
  titulo: Texto;
  /** Línea de apoyo bajo el título. */
  ayuda?: Texto;
  opciones: Opcion[];
}

/** Las preguntas, en el orden en que se hacen. */
export const preguntas: Pregunta[] = [
  {
    clave: "s",
    tipo: "una",
    titulo: { base: "¿Qué tipo de negocio tienes?" },
    opciones: [
      { codigo: "dental", etiqueta: { base: "Clínica dental" } },
      { codigo: "rural", etiqueta: { base: "Casa, apartamentos u hotel rural" } },
      { codigo: "despachos", etiqueta: { base: "Asesoría o despacho de abogados" } },
      { codigo: "otro", etiqueta: { base: "Otro tipo de negocio" } },
    ],
  },
  {
    clave: "canales",
    tipo: "varias",
    titulo: {
      base: "¿Por dónde te llegan los clientes?",
      dental: "¿Por dónde te llegan los pacientes?",
      rural: "¿Por dónde te llegan los huéspedes?",
    },
    ayuda: { base: "Marca todos los que uses." },
    opciones: [
      { codigo: "tel", etiqueta: { base: "Por teléfono" } },
      { codigo: "wa", etiqueta: { base: "Por WhatsApp" } },
      { codigo: "web", etiqueta: { base: "Por el formulario de la web" } },
      { codigo: "email", etiqueta: { base: "Por correo electrónico" } },
      { codigo: "redes", etiqueta: { base: "Por Instagram o Facebook" } },
      {
        codigo: "puerta",
        etiqueta: {
          base: "En persona, en el local",
          dental: "En persona, en la clínica",
          rural: "En persona, preguntando en la casa",
          despachos: "En persona, en el despacho",
        },
      },
      {
        codigo: "plataformas",
        etiqueta: { base: "Por Booking, Airbnb u otras plataformas" },
        soloEn: ["rural"],
      },
    ],
  },
  {
    clave: "reserva",
    tipo: "una",
    titulo: {
      base: "¿Cómo se pide una cita o una reserva?",
      dental: "¿Cómo se pide una cita?",
      rural: "¿Cómo se hace una reserva?",
      despachos: "¿Cómo se pide una primera consulta?",
    },
    opciones: [
      { codigo: "llamando", etiqueta: { base: "Solo llamando o por mensaje" } },
      {
        codigo: "online",
        etiqueta: {
          base: "La piden solos por internet",
          rural: "Reservan solos en mi propia web",
        },
      },
      {
        codigo: "plataformas",
        etiqueta: { base: "Solo por Booking, Airbnb o similares" },
        soloEn: ["rural"],
      },
      {
        codigo: "sin-cita",
        etiqueta: {
          base: "No trabajamos con cita",
          rural: "No trabajamos con reserva",
        },
      },
    ],
  },
  {
    clave: "fuera",
    tipo: "una",
    titulo: { base: "¿Qué pasa con los mensajes que llegan fuera de horario?" },
    opciones: [
      { codigo: "sin-contestar", etiqueta: { base: "Se quedan sin contestar" } },
      { codigo: "dia-siguiente", etiqueta: { base: "Los contesto al día siguiente" } },
      { codigo: "siempre", etiqueta: { base: "Siempre hay alguien que contesta" } },
      { codigo: "no-se", etiqueta: { base: "No lo sé" } },
    ],
  },
  {
    clave: "web",
    tipo: "una",
    titulo: { base: "¿Cómo estás en internet?" },
    opciones: [
      { codigo: "al-dia", etiqueta: { base: "Con web y ficha de Google, las dos al día" } },
      { codigo: "antigua", etiqueta: { base: "Tengo web, pero nadie la toca" } },
      { codigo: "solo-ficha", etiqueta: { base: "Solo con la ficha de Google" } },
      { codigo: "nada", etiqueta: { base: "Ni web ni ficha de Google" } },
      { codigo: "no-se", etiqueta: { base: "No lo sé" } },
    ],
  },
  {
    clave: "resenas",
    tipo: "una",
    titulo: {
      base: "¿Pides reseñas a tus clientes?",
      dental: "¿Pides reseñas a tus pacientes?",
      rural: "¿Pides reseñas a tus huéspedes?",
    },
    opciones: [
      { codigo: "siempre", etiqueta: { base: "Siempre" } },
      { codigo: "a-veces", etiqueta: { base: "A veces" } },
      { codigo: "nunca", etiqueta: { base: "Nunca" } },
    ],
  },
  {
    clave: "dolor",
    tipo: "una",
    titulo: { base: "Si pudieras quitarte una tarea, ¿cuál sería?" },
    opciones: [
      { codigo: "preguntas", etiqueta: { base: "Contestar siempre las mismas preguntas" } },
      {
        codigo: "agenda",
        etiqueta: {
          base: "Cuadrar citas y recordatorios",
          dental: "Cuadrar la agenda y los recordatorios de cita",
          rural: "Cuadrar el calendario de reservas",
          despachos: "Cuadrar citas con los clientes",
        },
      },
      {
        codigo: "papeles",
        etiqueta: {
          base: "Pedir y ordenar documentación",
          dental: "Pedir y ordenar los datos de cada paciente nuevo",
          rural: "Pedir los datos de cada huésped para el registro",
          despachos: "Pedir y ordenar la documentación de los clientes",
        },
      },
      { codigo: "cobros", etiqueta: { base: "Hacer facturas y perseguir cobros" } },
      {
        codigo: "clientes",
        etiqueta: {
          base: "Que me encuentren clientes nuevos",
          dental: "Que me encuentren pacientes nuevos",
          rural: "Que me encuentren huéspedes nuevos",
        },
      },
    ],
  },
];

/** Código de `reserva` que quita la opción `agenda` de `dolor` (spec §3.4). */
export const RESERVA_SIN_CITA = "sin-cita";
/** Opción de `dolor` que no sale con `reserva=sin-cita`. */
export const DOLOR_AGENDA = "agenda";

export interface NombreSector {
  codigo: Sector;
  /** Para el resultado: «Lo que haríamos en tu clínica dental». */
  negocio: string;
  /** Para `contacto.sector` de la auditoría, sin marca. `null`: no se rellena. */
  ficha: string | null;
}

/** El nombre de cada sector, en sus dos formas. */
export const nombresSector: NombreSector[] = [
  { codigo: "dental", negocio: "clínica dental", ficha: "Clínica dental" },
  { codigo: "rural", negocio: "alojamiento rural", ficha: "Alojamiento rural" },
  { codigo: "despachos", negocio: "asesoría o despacho", ficha: "Asesoría o despacho" },
  { codigo: "otro", negocio: "negocio", ficha: null },
];
