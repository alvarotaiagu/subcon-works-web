/**
 * Las páginas de sector (spec 001, §3.8): una entrada por sector con página.
 *
 * Lo cargan también los tests de Node (`--experimental-strip-types`): imports
 * relativos con `.ts`, tipos con `import type`, sin `@/` ni `process.env`.
 *
 * Los slugs no se escriben aquí: salen de `SLUG_SECTOR` (D-009), que no se
 * cambia nunca porque va en enlaces ya mandados.
 *
 * Reglas del contenido:
 * - Los problemas son del sector: un texto que valga cambiando el nombre del
 *   sector no vale.
 * - Las mejoras son ids del catálogo de `diagnostico.ts`, para que la página y
 *   el diagnóstico no se contradigan.
 * - La conversación solo enseña lo que el asistente (`recepcionista-ia`) hace
 *   hoy (D-008): en `dental`, cita con horas, datos mínimos, resumen y
 *   confirmación, y una urgencia que pasa a una persona sin diagnosticar; en
 *   `rural` y `despachos`, preguntas frecuentes y recogida de contacto, sin
 *   disponibilidad ni reservas. Nunca recordatorios ni WhatsApp.
 * - Negocios, personas y teléfonos inventados y que no parezcan reales
 *   («Clínica Dental Demo», `981 000 000`). Ninguna cifra sin fuente.
 *
 * Textos en borrador hasta que Álvaro los revise (P-03).
 */

import { SLUG_SECTOR } from "./diagnostico.ts";
import type { IdMejora, Sector } from "./diagnostico.ts";
import { site } from "./site.ts";

/** Sectores con página propia. `otro` no tiene: su diagnóstico vive en la portada. */
export type SectorConPagina = Exclude<Sector, "otro">;

export interface ProblemaSector {
  titulo: string;
  texto: string;
}

export interface MensajeChat {
  de: "cliente" | "asistente";
  texto: string;
}

export interface PaginaSector {
  codigo: SectorConPagina;
  /** D-009. Sale de `SLUG_SECTOR`; no se escribe a mano. */
  slug: string;
  /** Nombre en la página y en las tarjetas de `/sectores/`. */
  nombre: string;
  /** Etiqueta de la cabecera. */
  etiqueta: string;
  /** Sobre el problema, no sobre nosotros. */
  titular: string;
  entradilla: string;
  metadatos: { title: string; description: string };
  /** De 3 a 4, propios del sector. */
  problemas: ProblemaSector[];
  /** De 4 a 6 ids del catálogo, todos aplicables al sector. */
  mejoras: IdMejora[];
  /** El negocio inventado del ejemplo del asistente. */
  ejemplo: {
    /** Completa «Así contestaría el asistente de …». */
    de: string;
    /** Nombre del negocio inventado, en la cabecera del chat. */
    negocio: string;
  };
  /** De 6 a 10 mensajes. */
  conversacion: MensajeChat[];
  /** Slugs de `plantillas.ts`. Vacío: el bloque de plantillas no sale (D-007). */
  plantillas: string[];
}

function slugDe(codigo: SectorConPagina): string {
  const slug = SLUG_SECTOR.get(codigo);
  if (!slug) throw new Error(`Falta el slug del sector «${codigo}» en SLUG_SECTOR`);
  return slug;
}

const paginas: Omit<PaginaSector, "slug">[] = [
  {
    codigo: "dental",
    nombre: "Clínicas dentales",
    etiqueta: "Clínicas dentales",
    titular: "Que el teléfono no saque a nadie del gabinete",
    entradilla:
      "Citas, preguntas de siempre, reseñas y la ficha del paciente nuevo: lo que puede quedar funcionando solo para que recepción atienda a quien ya está en la clínica.",
    metadatos: {
      title: `Webs y automatización para clínicas dentales — ${site.nombre}`,
      description:
        "Citas sin llamar, respuestas a cualquier hora y la ficha del paciente antes de la primera visita. Lo que se puede automatizar en una clínica dental, con un ejemplo del asistente.",
    },
    problemas: [
      {
        titulo: "El teléfono suena en mitad de un tratamiento",
        texto:
          "Quien coge el teléfono también ayuda en el gabinete o esteriliza instrumental. Si suena en ese momento, la llamada se pierde, y el paciente que no vuelve a llamar pide cita en otra clínica.",
      },
      {
        titulo: "Una hora de sillón que se queda vacía",
        texto:
          "Un paciente que cancela la víspera deja el gabinete parado. Si las horas libres solo se saben llamando a la clínica, ese hueco no lo coge nadie, aunque haya quien lo quisiera.",
      },
      {
        titulo: "Las mismas preguntas, todos los días",
        texto:
          "Si trabajáis con tal seguro, si la primera visita se paga, si la ortodoncia se puede pagar a plazos. Son siempre las mismas, y cada una corta lo que se estaba haciendo.",
      },
      {
        titulo: "Un dolor de muela un domingo por la noche",
        texto:
          "Llega por el formulario de la web o por un mensaje en redes, nadie lo lee hasta el lunes y el paciente no sabe a quién llamar. Una urgencia tiene que llegar a una persona, y rápido.",
      },
    ],
    mejoras: ["reservas-online", "asistente", "documentacion", "resenas", "ficha-google"],
    ejemplo: { de: "una clínica", negocio: "Clínica Dental Demo" },
    conversacion: [
      {
        de: "asistente",
        texto:
          "Hola, soy la asistente virtual de Clínica Dental Demo. Puedo resolver dudas y pedirte cita. ¿En qué te ayudo?",
      },
      { de: "cliente", texto: "Quiero una limpieza el jueves por la tarde." },
      {
        de: "asistente",
        texto: "El jueves por la tarde tengo libres las 16:30, las 17:00 y las 18:30. ¿Cuál te viene mejor?",
      },
      { de: "cliente", texto: "Las 17:00." },
      {
        de: "asistente",
        texto: "Perfecto. Para reservarla solo necesito tu nombre y un teléfono de contacto.",
      },
      { de: "cliente", texto: "Ana Ejemplo, 600 000 000." },
      {
        de: "asistente",
        texto:
          "Te resumo: limpieza dental el jueves a las 17:00, a nombre de Ana Ejemplo, con el teléfono 600 000 000. ¿La reservo?",
      },
      {
        de: "cliente",
        texto: "Sí. Y otra cosa: me duele muchísimo una muela y tengo la cara hinchada.",
      },
      {
        de: "asistente",
        texto:
          "Reservada la limpieza del jueves a las 17:00. Lo del dolor no puedo valorarlo yo: tiene que verlo el equipo cuanto antes. Llama ahora a la clínica al 981 000 000 y te dirán qué hacer.",
      },
      { de: "cliente", texto: "Vale, llamo ahora. Gracias." },
    ],
    plantillas: [],
  },
  {
    codigo: "rural",
    nombre: "Casas, apartamentos y hoteles rurales",
    etiqueta: "Alojamientos rurales",
    titular: "Que no todas las reservas tengan que pasar por Booking",
    entradilla:
      "Una web con reservas propias, las respuestas de siempre a cualquier hora y los datos del huésped antes de que llegue, para que las plataformas sean una vía más y no la única.",
    metadatos: {
      title: `Webs y automatización para alojamientos rurales — ${site.nombre}`,
      description:
        "Reservas en tu propia web, respuestas a cualquier hora y el registro de viajeros antes de la llegada. Lo que se puede automatizar en una casa o un hotel rural, con un ejemplo del asistente.",
    },
    problemas: [
      {
        titulo: "La comisión, también del huésped que repite",
        texto:
          "Quien ya estuvo en la casa y quiere volver la busca en Booking, porque es donde la encontró, y esa noche vuelve a pagar comisión. Sin una web donde reservar contigo, la plataforma se queda también con los que ya te conocen.",
      },
      {
        titulo: "Calendarios que no se hablan",
        texto:
          "Las reservas por teléfono en una libreta o en el móvil; las de Booking y Airbnb, cada una en su panel. Cada reserva nueva obliga a cerrar a mano las mismas fechas en los demás sitios, y un descuido vende dos veces la misma noche.",
      },
      {
        titulo: "Las preguntas llegan cuando estás limpiando",
        texto:
          "Cómo se llega por la pista, si hay cobertura, si se admiten perros, a qué hora se entrega la llave. Llegan de noche y en fin de semana, que es justo cuando hay huéspedes entrando y saliendo.",
      },
      {
        titulo: "El registro de viajeros, uno a uno en la entrada",
        texto:
          "Cada huésped tiene que dar sus datos para el registro, y pedírselos a la llegada, con las maletas en la puerta, es lento para los dos. Con un grupo, más.",
      },
    ],
    mejoras: ["reservas-directas", "asistente", "documentacion", "resenas", "web-nueva", "ficha-google"],
    ejemplo: { de: "un alojamiento", negocio: "Casa Rural Demo" },
    conversacion: [
      {
        de: "asistente",
        texto:
          "Hola, soy el asistente virtual de Casa Rural Demo. Puedo resolver dudas sobre la casa y, si quieres reservar, dejar tu contacto para que te llame quien lleva las reservas. ¿En qué te ayudo?",
      },
      { de: "cliente", texto: "¿Admitís perros?" },
      {
        de: "asistente",
        texto:
          "Sí, avisando al hacer la reserva. Pueden estar en las zonas comunes y en el jardín, pero no en los dormitorios.",
      },
      { de: "cliente", texto: "¿Y a qué hora se puede entrar? Llegaríamos tarde, sobre las diez de la noche." },
      {
        de: "asistente",
        texto:
          "La entrada es a partir de las cuatro de la tarde. Si llegáis más tarde se os puede dejar la llave preparada, pero hay que acordarlo antes con la casa.",
      },
      { de: "cliente", texto: "¿Tenéis libre el puente de diciembre para cuatro personas y el perro?" },
      {
        de: "asistente",
        texto:
          "Las fechas libres no las veo yo: las confirma la persona que lleva las reservas. Si me dejas tu nombre y un teléfono o un correo, te llama para cerrarlo.",
      },
      { de: "cliente", texto: "Marta Ejemplo, 600 000 000." },
      {
        de: "asistente",
        texto:
          "Apuntado: Marta Ejemplo, 600 000 000, puente de diciembre, cuatro personas y un perro. Te llamarán de Casa Rural Demo para decirte si hay sitio y el precio.",
      },
    ],
    plantillas: ["hotel-rural"],
  },
  {
    codigo: "despachos",
    nombre: "Asesorías y despachos",
    etiqueta: "Asesorías y despachos",
    titular: "Menos llamadas de «¿lleváis esto?» y menos papeles por WhatsApp",
    entradilla:
      "Las primeras preguntas, la documentación de cada cliente y las citas pueden ir solas, para que el tiempo del despacho se vaya en los asuntos y no en lo que los rodea.",
    metadatos: {
      title: `Webs y automatización para asesorías y despachos — ${site.nombre}`,
      description:
        "Documentación que llega ordenada, primeras consultas sin llamar y respuestas a cualquier hora. Lo que se puede automatizar en una asesoría o un despacho de abogados, con un ejemplo del asistente.",
    },
    problemas: [
      {
        titulo: "Llamadas para saber si lleváis su asunto",
        texto:
          "Antes de ser cliente, la gente llama para preguntar si lleváis herencias, despidos o la renta de un autónomo, y cuánto cuesta la primera consulta. Cada llamada saca a alguien de un expediente.",
      },
      {
        titulo: "La documentación llega en fotos por WhatsApp",
        texto:
          "Nóminas, escrituras, facturas del trimestre: llegan en fotos torcidas por WhatsApp, en correos sueltos y en mano. Juntarlas en cada expediente y ver qué falta es trabajo que no se factura.",
      },
      {
        titulo: "Todo el mundo, el último día",
        texto:
          "En la campaña de la renta y en cada cierre de trimestre, los papeles llegan a la vez y a última hora. Ir avisando cliente por cliente de lo que le falta se come los días que más trabajo hay.",
      },
      {
        titulo: "La carta de Hacienda se lee de noche",
        texto:
          "Quien recibe un requerimiento o una carta de despido busca ayuda esa misma noche. Si la web solo tiene un teléfono, espera a la mañana siguiente, y puede que llame antes a otro despacho.",
      },
    ],
    mejoras: ["documentacion", "formularios", "asistente", "reservas-online", "cobros", "resenas"],
    ejemplo: { de: "un despacho", negocio: "Despacho Demo" },
    conversacion: [
      {
        de: "asistente",
        texto:
          "Hola, soy el asistente virtual de Despacho Demo. Puedo contarte qué asuntos llevamos y cómo trabajamos, y dejar tu contacto para que te llame una persona del despacho. ¿En qué te ayudo?",
      },
      { de: "cliente", texto: "Me ha llegado una carta de Hacienda por la renta del año pasado. ¿Lleváis eso?" },
      {
        de: "asistente",
        texto:
          "Sí, el despacho lleva requerimientos y comprobaciones de Hacienda. Qué dice tu carta y qué conviene hacer lo valora una persona del despacho: yo no puedo asesorarte sobre tu caso.",
      },
      { de: "cliente", texto: "¿Qué tengo que llevar a la primera consulta?" },
      {
        de: "asistente",
        texto:
          "La carta, la declaración de ese año y tu DNI. Si no tienes la declaración a mano, en la consulta te ayudan a sacarla.",
      },
      { de: "cliente", texto: "¿Me podéis dar hora para mañana?" },
      {
        de: "asistente",
        texto:
          "Las citas no las doy yo. Si me dejas tu nombre y un teléfono o un correo, una persona del despacho te contacta para darte hora.",
      },
      { de: "cliente", texto: "Jorge Ejemplo, jorge@ejemplo.com." },
      {
        de: "asistente",
        texto:
          "Apuntado: Jorge Ejemplo, jorge@ejemplo.com, por una carta de Hacienda sobre la renta. Te escribirán de Despacho Demo para darte hora.",
      },
    ],
    plantillas: ["abogados-trinquete", "abogados-portico", "abogados-contraluz"],
  },
];

export const sectores: PaginaSector[] = paginas.map((p) => ({ ...p, slug: slugDe(p.codigo) }));

const PORSLUG: ReadonlyMap<string, PaginaSector> = new Map(sectores.map((s) => [s.slug, s]));

/** La página de un slug, o `undefined`. Con `Map`: un slug de fuera no encuentra nada del prototipo. */
export function sectorPorSlug(slug: string): PaginaSector | undefined {
  return PORSLUG.get(slug);
}
