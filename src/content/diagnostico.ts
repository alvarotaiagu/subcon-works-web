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

/**
 * Slug de la página de cada sector (D-009). **No se cambian nunca**: van en
 * los enlaces ya mandados. `otro` no tiene página: su diagnóstico vive en la
 * portada. Es un `Map` para que un código que llegue de fuera no encuentre
 * nada del prototipo. `sectores.ts` (T06) lo importa de aquí.
 */
export const SLUG_SECTOR: ReadonlyMap<Sector, string> = new Map<Sector, string>([
  ["dental", "clinicas-dentales"],
  ["rural", "alojamientos-rurales"],
  ["despachos", "asesorias-y-despachos"],
]);

// ── Textos para la auditoría (spec §3.1 y §3.6, D-004) ─────────────────────

/**
 * Marca con la que acaba cada respuesta prerrellenada. El kit transcribe las P
 * tal cual, y así el informe sabe que esa respuesta sale del diagnóstico (que
 * puede haber hecho Álvaro por el prospecto), no de lo que escribió el negocio.
 */
export const MARCA_DIAGNOSTICO = " (del diagnóstico rápido)";

/** Las P de la auditoría (`auditoria.ts`) que puede prerrellenar el diagnóstico. */
export type PAuditoria = "P2" | "P7" | "P10" | "P12" | "P14" | "P23" | "P35";

/**
 * Una frase de prerrelleno: si la respuesta a `pregunta` es `codigo`, la P
 * `p` se rellena con `texto` (sin la marca; la pone `aRespuestasAuditoria`).
 * En el tono de quien responde. Las «No lo sé» no tienen frase: nunca
 * prerrellenan nada. `canales` (P7) no va aquí: se escribe con
 * `nombresCanal`, porque es una lista.
 *
 * Textos en borrador hasta que Álvaro los revise (P-03).
 */
export interface FrasePrerrelleno {
  pregunta: Exclude<Clave, "canales">;
  codigo: string;
  p: PAuditoria;
  texto: Texto;
}

export const frasesPrerrelleno: FrasePrerrelleno[] = [
  // P2 · A qué os dedicáis, en una frase. `s=otro` no rellena.
  { pregunta: "s", codigo: "dental", p: "P2", texto: { base: "Somos una clínica dental" } },
  { pregunta: "s", codigo: "rural", p: "P2", texto: { base: "Tenemos un alojamiento rural" } },
  {
    pregunta: "s",
    codigo: "despachos",
    p: "P2",
    texto: { base: "Somos una asesoría o un despacho de abogados" },
  },

  // P14 · ¿Puede el cliente reservar él solo por internet? (y P12 con sin-cita)
  { pregunta: "reserva", codigo: "llamando", p: "P14", texto: { base: "No, solo llamando o por mensaje" } },
  {
    pregunta: "reserva",
    codigo: "online",
    p: "P14",
    texto: { base: "Sí, reservan solos por internet", rural: "Sí, reservan solos en nuestra web" },
  },
  {
    pregunta: "reserva",
    codigo: "plataformas",
    p: "P14",
    texto: { base: "Solo a través de plataformas como Booking o Airbnb" },
  },
  {
    pregunta: "reserva",
    codigo: "sin-cita",
    p: "P14",
    texto: { base: "No trabajamos con cita", rural: "No trabajamos con reserva" },
  },
  // P12 · ¿Dónde apuntáis las citas? La auditoría pide escribir justo esto.
  { pregunta: "reserva", codigo: "sin-cita", p: "P12", texto: { base: "No trabajamos con cita" } },

  // P10 · ¿Qué pasa con lo que llega fuera de horario? `no-se` no rellena.
  { pregunta: "fuera", codigo: "sin-contestar", p: "P10", texto: { base: "Se quedan sin contestar" } },
  { pregunta: "fuera", codigo: "dia-siguiente", p: "P10", texto: { base: "Los contestamos al día siguiente" } },
  { pregunta: "fuera", codigo: "siempre", p: "P10", texto: { base: "Siempre hay alguien que contesta" } },

  // P23 · ¿Pedís reseñas?
  { pregunta: "resenas", codigo: "siempre", p: "P23", texto: { base: "Sí, las pedimos siempre" } },
  { pregunta: "resenas", codigo: "a-veces", p: "P23", texto: { base: "Sí, pero solo a veces" } },
  { pregunta: "resenas", codigo: "nunca", p: "P23", texto: { base: "No, no las pedimos" } },

  // P35 · Si pudieras arreglar una sola cosa del día a día, ¿cuál sería?
  {
    pregunta: "dolor",
    codigo: "preguntas",
    p: "P35",
    texto: { base: "Dejar de contestar siempre las mismas preguntas" },
  },
  {
    pregunta: "dolor",
    codigo: "agenda",
    p: "P35",
    texto: {
      base: "Cuadrar las citas y los recordatorios",
      dental: "Cuadrar la agenda y los recordatorios de cita",
      rural: "Cuadrar el calendario de reservas",
      despachos: "Cuadrar las citas con los clientes",
    },
  },
  {
    pregunta: "dolor",
    codigo: "papeles",
    p: "P35",
    texto: {
      base: "Pedir y ordenar la documentación",
      dental: "Pedir y ordenar los datos de cada paciente nuevo",
      rural: "Pedir los datos de cada huésped para el registro",
      despachos: "Pedir y ordenar la documentación de los clientes",
    },
  },
  { pregunta: "dolor", codigo: "cobros", p: "P35", texto: { base: "Hacer las facturas y perseguir los cobros" } },
  {
    pregunta: "dolor",
    codigo: "clientes",
    p: "P35",
    texto: {
      base: "Que nos encuentren clientes nuevos",
      dental: "Que nos encuentren pacientes nuevos",
      rural: "Que nos encuentren huéspedes nuevos",
    },
  },
];

/** Cómo se nombra cada canal en P7: «Por estos canales, sin orden: …». */
export const nombresCanal: { codigo: string; nombre: Texto }[] = [
  { codigo: "tel", nombre: { base: "teléfono" } },
  { codigo: "wa", nombre: { base: "WhatsApp" } },
  { codigo: "web", nombre: { base: "el formulario de la web" } },
  { codigo: "email", nombre: { base: "correo electrónico" } },
  { codigo: "redes", nombre: { base: "Instagram o Facebook" } },
  {
    codigo: "puerta",
    nombre: {
      base: "en persona en el local",
      dental: "en persona en la clínica",
      rural: "en persona en la casa",
      despachos: "en persona en el despacho",
    },
  },
  { codigo: "plataformas", nombre: { base: "plataformas como Booking o Airbnb" } },
];

/** Arranque de la frase de P7. No ordena de más a menos: no se preguntó. */
export const INICIO_CANALES = "Por estos canales, sin orden: ";

// ── Mejoras y reglas (spec §3.3 y §3.4, PD-5) ──────────────────────────────

export type IdMejora =
  | "reservas-online"
  | "reservas-directas"
  | "asistente"
  | "formularios"
  | "ficha-google"
  | "web-nueva"
  | "informe-web"
  | "resenas"
  | "documentacion"
  | "cobros"
  | "clientes-nuevos";

/**
 * Destino del enlace de una mejora según dónde esté el diagnóstico. El valor
 * especial `"plantillas-sector"` lo resuelve `resolverEnlace`: al bloque de
 * plantillas de la página si lo tiene; si no, a `/plantillas/`.
 */
export interface EnlaceMejora {
  portada?: string;
  sector?: string;
}

export const ENLACE_PLANTILLAS_SECTOR = "plantillas-sector";

export interface Mejora {
  id: IdMejora;
  titulo: Texto;
  /** Qué resuelve, en una o dos frases. */
  queResuelve: Texto;
  enlace?: EnlaceMejora;
  /** Sectores donde aplica. */
  sectores: Sector[];
}

const TODOS: Sector[] = ["dental", "rural", "despachos", "otro"];

/**
 * El catálogo. Describe mejoras que puede montar cualquier agencia que sepa
 * hacerlo, no productos nuestros: solo se enlaza a algo nuestro cuando existe
 * y hace lo que dice el texto.
 *
 * Copy de capacidad, no de condiciones. Ninguna cifra sin fuente. Y ningún
 * texto da a entender que el asistente (`recepcionista-ia`) manda
 * recordatorios o atiende WhatsApp: hoy no hace ninguna de las dos cosas. Los
 * recordatorios de `reservas-online` y los avisos de `cobros` son del sistema
 * de citas y del de facturas, no del asistente.
 *
 * Textos en borrador hasta que Álvaro los revise (P-03).
 */
export const mejoras: Mejora[] = [
  {
    id: "reservas-online",
    titulo: {
      base: "Que pidan cita sin llamar",
      despachos: "Que pidan la primera consulta sin llamar",
    },
    queResuelve: {
      base: "Un calendario en tu web con tus horas libres de verdad: el cliente elige la suya y el sistema de citas le manda la confirmación y un recordatorio antes de venir. Tú dejas de cuadrar huecos al teléfono.",
      dental:
        "Un calendario en tu web con las horas libres de verdad: el paciente elige la suya y el sistema de citas le manda la confirmación y un recordatorio antes de venir. Recepción deja de cuadrar huecos al teléfono.",
      despachos:
        "Un calendario en tu web con los huecos que guardas para primeras consultas: el cliente elige uno, cuenta en una línea de qué va su asunto y el sistema de citas le manda la confirmación y un recordatorio.",
    },
    sectores: ["dental", "despachos", "otro"],
  },
  {
    id: "reservas-directas",
    titulo: { base: "Reservas en tu propia web" },
    queResuelve: {
      base: "Un motor de reservas en tu web, con el calendario enlazado al de Booking y Airbnb para no vender dos veces la misma noche. Quien ya te conoce reserva contigo, y las plataformas quedan para que te encuentren los nuevos.",
    },
    enlace: { portada: "/plantillas/", sector: ENLACE_PLANTILLAS_SECTOR },
    sectores: ["rural"],
  },
  {
    id: "asistente",
    titulo: { base: "Que alguien conteste fuera de horario" },
    queResuelve: {
      base: "Un asistente en tu web que contesta lo de siempre a cualquier hora y recoge los datos de quien necesita hablar contigo, para que le llames tú.",
      dental:
        "Un asistente en tu web que contesta lo de siempre a cualquier hora, ofrece las horas libres para pedir cita y pasa a una persona lo que no le toca, como una urgencia. No da consejos clínicos.",
      rural:
        "Un asistente en tu web que contesta a cualquier hora lo que siempre se pregunta (cómo llegar, a qué hora es la entrada, si se admiten mascotas) y te deja el contacto de quien quiere que le llames.",
      despachos:
        "Un asistente en tu web que contesta a cualquier hora lo que siempre se pregunta (horario, qué llevar a la primera consulta, qué asuntos lleváis) y recoge el contacto para que llame una persona.",
    },
    enlace: { portada: "/#servicios", sector: "#asistente" },
    sectores: TODOS,
  },
  {
    id: "formularios",
    titulo: { base: "Mensajes de la web que llegan ordenados" },
    queResuelve: {
      base: "Un formulario propio en tu web que te deja cada mensaje en tu correo, con los mismos datos siempre, y le confirma a quien escribe que lo has recibido. Sin el formulario de otra empresa incrustado.",
    },
    enlace: { portada: "/herramientas/#formularios", sector: "/herramientas/#formularios" },
    sectores: TODOS,
  },
  {
    id: "ficha-google",
    titulo: { base: "Tu ficha de Google, completa y al día" },
    queResuelve: {
      base: "Horario, teléfono, dirección y enlace a la web revisados y coherentes con lo que dice tu web, para que quien te busca en el mapa sepa a qué atenerse antes de llamarte.",
    },
    enlace: { portada: "/herramientas/#ficha-google", sector: "/herramientas/#ficha-google" },
    sectores: TODOS,
  },
  {
    id: "web-nueva",
    titulo: { base: "Una web que puedas cambiar tú" },
    queResuelve: {
      base: "Una web rápida en el móvil, que cuenta lo que haces y cómo contactarte, y en la que cambiar un horario o un texto no depende de nadie.",
      dental:
        "Una web rápida en el móvil, con tus tratamientos, tu equipo y cómo pedir cita, en la que cambiar un horario o un texto no depende de nadie.",
      rural:
        "Una web rápida en el móvil, con tus fotos, tus habitaciones y la zona, en la que cambiar una tarifa o un texto no depende de nadie.",
      despachos:
        "Una web rápida en el móvil, que explica qué asuntos llevas y cómo se trabaja contigo, y en la que cambiar un texto no depende de nadie.",
    },
    enlace: { portada: "/plantillas/", sector: ENLACE_PLANTILLAS_SECTOR },
    sectores: TODOS,
  },
  {
    id: "informe-web",
    titulo: { base: "Saber qué falla en tu web" },
    queResuelve: {
      base: "Un repaso con pruebas de la velocidad, el móvil, la accesibilidad y los textos, con cada fallo ordenado por prioridad para arreglar primero lo que más pesa.",
    },
    enlace: { portada: "/herramientas/#informe", sector: "/herramientas/#informe" },
    sectores: TODOS,
  },
  {
    id: "resenas",
    titulo: { base: "Que la reseña se pida sola" },
    queResuelve: {
      base: "Después de cada servicio, el cliente recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que tengas que acordarte.",
      dental:
        "Después de la visita, el paciente recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que recepción tenga que acordarse.",
      rural:
        "Al acabar la estancia, el huésped recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que tengas que acordarte.",
      despachos:
        "Al cerrar un asunto, el cliente recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que tengas que acordarte.",
    },
    sectores: TODOS,
  },
  {
    id: "documentacion",
    titulo: {
      base: "Los papeles, en un sitio ordenado",
      dental: "La ficha del paciente, antes de la primera visita",
      rural: "Los datos del huésped, antes de que llegue",
      despachos: "La documentación, ordenada y no por WhatsApp",
    },
    queResuelve: {
      base: "Un formulario donde el cliente te manda lo que le pides, con la lista de lo que falta a la vista. Todo llega junto y con su nombre, no repartido entre el correo y el móvil.",
      dental:
        "El paciente nuevo rellena sus datos desde casa antes de venir y te llegan completos y legibles, en vez de en papel en la sala de espera.",
      rural:
        "El huésped deja los datos del registro de viajeros en un formulario antes de llegar, y no hay que pedírselos uno a uno en la entrada.",
      despachos:
        "Cada cliente sube su documentación a un formulario con la lista de lo que falta. Llega junta y con su nombre, no repartida entre el correo y el WhatsApp.",
    },
    sectores: TODOS,
  },
  {
    id: "cobros",
    titulo: { base: "Facturas y cobros que salen solos" },
    queResuelve: {
      base: "La factura se hace al cerrar el trabajo y, si no se paga, el aviso de cobro sale en su fecha. Ya no persigues a nadie y ves de un vistazo qué falta por cobrar.",
    },
    enlace: { portada: "/#servicios", sector: "/#servicios" },
    sectores: TODOS,
  },
  {
    id: "clientes-nuevos",
    titulo: { base: "Aparecer cuando te buscan" },
    queResuelve: {
      base: "La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca lo tuyo cerca.",
      dental:
        "La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca dentista cerca de casa.",
      rural:
        "La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca dónde dormir por la zona.",
      despachos:
        "La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca asesoría o abogado en tu zona.",
    },
    enlace: { portada: "/#servicios", sector: "/#servicios" },
    sectores: TODOS,
  },
];

/** Condición sobre una respuesta; en `canales` basta con que esté marcado alguno. */
export interface Condicion {
  pregunta: ClaveRespuesta;
  en: string[];
}

/**
 * Una regla (PD-5): si la respuesta a `pregunta` (o, en `canales`, alguno de
 * los marcados) está en `en`, se propone `mejora` con su `porque`. Una sola
 * condición por regla: una mejora con dos disparadores son dos reglas.
 * «No lo sé» no sale en ninguna `en`: nunca dispara nada.
 */
export interface Regla {
  mejora: IdMejora;
  si: Condicion;
  /** Mayor primero. */
  prioridad: number;
  porque: Texto;
}

/**
 * Prioridades: manda lo que la persona se quitaría de encima (`dolor`); luego
 * lo que se pierde hoy (citas solo por teléfono, mensajes sin contestar, no
 * estar en internet); y al final lo que mejora algo que ya funciona. Con la
 * misma prioridad gana la que va antes en la lista.
 */
export const reglas: Regla[] = [
  // Lo que se quitaría de encima.
  {
    mejora: "asistente",
    si: { pregunta: "dolor", en: ["preguntas"] },
    prioridad: 100,
    porque: { base: "Porque lo que más te quitarías de encima es contestar siempre las mismas preguntas." },
  },
  {
    mejora: "reservas-online",
    si: { pregunta: "dolor", en: ["agenda"] },
    prioridad: 100,
    porque: {
      base: "Porque lo que más te quitarías de encima es cuadrar citas.",
      dental: "Porque lo que más te quitarías de encima es cuadrar la agenda.",
    },
  },
  {
    mejora: "reservas-directas",
    si: { pregunta: "dolor", en: ["agenda"] },
    prioridad: 100,
    porque: { base: "Porque lo que más te quitarías de encima es cuadrar el calendario de reservas." },
  },
  {
    mejora: "documentacion",
    si: { pregunta: "dolor", en: ["papeles"] },
    prioridad: 100,
    porque: {
      base: "Porque lo que más te quitarías de encima es pedir y ordenar papeles.",
      dental: "Porque lo que más te quitarías de encima es pedir los datos de cada paciente nuevo.",
      rural: "Porque lo que más te quitarías de encima es pedir los datos de cada huésped.",
      despachos: "Porque lo que más te quitarías de encima es pedir y ordenar la documentación de tus clientes.",
    },
  },
  {
    mejora: "cobros",
    si: { pregunta: "dolor", en: ["cobros"] },
    prioridad: 100,
    porque: { base: "Porque lo que más te quitarías de encima son las facturas y los cobros." },
  },
  {
    mejora: "clientes-nuevos",
    si: { pregunta: "dolor", en: ["clientes"] },
    prioridad: 100,
    porque: {
      base: "Porque lo que más quieres es que te encuentren clientes nuevos.",
      dental: "Porque lo que más quieres es que te encuentren pacientes nuevos.",
      rural: "Porque lo que más quieres es que te encuentren huéspedes nuevos.",
    },
  },

  // Citas y reservas.
  {
    mejora: "reservas-directas",
    si: { pregunta: "reserva", en: ["plataformas"] },
    prioridad: 85,
    porque: { base: "Porque nos dijiste que las reservas solo te entran por plataformas como Booking o Airbnb." },
  },
  {
    mejora: "reservas-online",
    si: { pregunta: "reserva", en: ["llamando"] },
    prioridad: 80,
    porque: {
      base: "Porque nos dijiste que las citas solo se piden llamando o por mensaje.",
      despachos: "Porque nos dijiste que la primera consulta solo se pide llamando o por mensaje.",
    },
  },
  {
    mejora: "reservas-directas",
    si: { pregunta: "reserva", en: ["llamando"] },
    prioridad: 80,
    porque: { base: "Porque nos dijiste que las reservas solo llegan llamando o por mensaje." },
  },
  {
    mejora: "reservas-directas",
    si: { pregunta: "canales", en: ["plataformas"] },
    prioridad: 60,
    porque: { base: "Porque nos dijiste que parte de tus huéspedes te llegan por Booking, Airbnb o similares." },
  },

  // Fuera de horario.
  {
    mejora: "asistente",
    si: { pregunta: "fuera", en: ["sin-contestar"] },
    prioridad: 85,
    porque: { base: "Porque nos dijiste que los mensajes de fuera de horario se quedan sin contestar." },
  },
  {
    mejora: "asistente",
    si: { pregunta: "fuera", en: ["dia-siguiente"] },
    prioridad: 70,
    porque: { base: "Porque nos dijiste que lo que llega fuera de horario espera al día siguiente." },
  },

  // Internet.
  {
    mejora: "web-nueva",
    si: { pregunta: "web", en: ["nada"] },
    prioridad: 75,
    porque: { base: "Porque nos dijiste que no tienes web." },
  },
  {
    mejora: "ficha-google",
    si: { pregunta: "web", en: ["nada"] },
    prioridad: 72,
    porque: { base: "Porque nos dijiste que tampoco tienes ficha de Google, y es lo primero que sale en el mapa." },
  },
  {
    mejora: "ficha-google",
    si: { pregunta: "web", en: ["solo-ficha"] },
    prioridad: 72,
    porque: { base: "Porque nos dijiste que en internet solo tienes la ficha de Google: tiene que estar impecable." },
  },
  {
    mejora: "web-nueva",
    si: { pregunta: "web", en: ["antigua"] },
    prioridad: 65,
    porque: { base: "Porque nos dijiste que tienes web, pero nadie la toca." },
  },
  {
    mejora: "ficha-google",
    si: { pregunta: "web", en: ["antigua"] },
    prioridad: 50,
    porque: { base: "Porque nos dijiste que tu web no la toca nadie, y la ficha de Google se suele quedar igual de atrás." },
  },
  {
    mejora: "informe-web",
    si: { pregunta: "web", en: ["al-dia"] },
    prioridad: 40,
    porque: { base: "Porque nos dijiste que tu web está al día: lo siguiente es comprobar que nada falla por dentro." },
  },

  // Reseñas.
  {
    mejora: "resenas",
    si: { pregunta: "resenas", en: ["nunca"] },
    prioridad: 60,
    porque: { base: "Porque nos dijiste que no pides reseñas." },
  },
  {
    mejora: "resenas",
    si: { pregunta: "resenas", en: ["a-veces"] },
    prioridad: 45,
    porque: { base: "Porque nos dijiste que las reseñas las pides solo a veces." },
  },

  // Canales.
  {
    mejora: "formularios",
    si: { pregunta: "canales", en: ["web"] },
    prioridad: 35,
    porque: { base: "Porque nos dijiste que te escriben desde la web." },
  },
  {
    mejora: "formularios",
    si: { pregunta: "canales", en: ["email"] },
    prioridad: 30,
    porque: { base: "Porque nos dijiste que te escriben por correo." },
  },
];

/**
 * Exclusiones por respuesta: si se cumple `si`, ninguna de estas `mejoras`
 * sale en el resultado, ni por regla ni por relleno. Es la forma de que el
 * diagnóstico no proponga algo que contradice lo que la persona ha respondido
 * (spec §3.4, D-013).
 */
export interface Exclusion {
  si: Condicion;
  mejoras: IdMejora[];
}

export const exclusiones: Exclusion[] = [
  // Ya piden solos por internet: no hace falta enseñarles a pedir sin llamar.
  { si: { pregunta: "reserva", en: ["online"] }, mejoras: ["reservas-online", "reservas-directas"] },
  // Sin cita ni reserva, un calendario de citas no tiene sentido.
  { si: { pregunta: "reserva", en: [RESERVA_SIN_CITA] }, mejoras: ["reservas-online", "reservas-directas"] },
];

export interface RellenoSector {
  sector: Sector;
  /**
   * Si salen menos de 3 mejoras, se completa con estas, en orden, sin repetir
   * y saltándose las excluidas por las respuestas. Hay más de 3 para que
   * siempre queden 3 aunque se excluyan las primeras.
   */
  mejoras: IdMejora[];
  /** El porqué de las mejoras que entran por relleno. */
  porque: string;
}

export const relleno: RellenoSector[] = [
  {
    sector: "dental",
    mejoras: ["reservas-online", "resenas", "asistente", "ficha-google", "formularios"],
    porque: "Es de lo que más compensa en una clínica dental.",
  },
  {
    sector: "rural",
    mejoras: ["reservas-directas", "resenas", "ficha-google", "asistente", "web-nueva"],
    porque: "Es de lo que más compensa en un alojamiento rural.",
  },
  {
    sector: "despachos",
    mejoras: ["documentacion", "formularios", "asistente", "resenas", "ficha-google"],
    porque: "Es de lo que más compensa en una asesoría o un despacho.",
  },
  {
    sector: "otro",
    mejoras: ["ficha-google", "resenas", "asistente", "formularios", "web-nueva"],
    porque: "Es de lo que más compensa en casi cualquier negocio.",
  },
];
