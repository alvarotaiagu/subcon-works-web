/**
 * Textos de la versión «consultora tecnológica» de la portada (rama `exp/consultora`,
 * experimento para comparar con la portada vigente). Sin imports, como `portada.ts`.
 *
 * Reglas que se mantienen de la web vigente: nada de clientes, cifras de ahorro, plazos
 * ni precios inventados; los ejemplos van siempre rotulados «Ejemplo» (D-019); lo que se
 * enseña en «Webs de ejemplo» es lo que existe de verdad en este repo (plantillas ficticias,
 * el informe, el formulario y la tienda de `herramientas.ts`).
 *
 * Los textos son los aprobados en `specs/003-posicionamiento-y-textos/textos.md` (D-033).
 */

export const hero = {
  linea1: "Lo de arriba vende.",
  linea2: "Lo de abajo",
  linea2em: "trabaja.",
  /** Los dos párrafos bajo el titular. */
  parrafos: [
    "Montamos lo que se ve y lo que va debajo. Arriba, lo que ve tu cliente: la web, la tienda online y la ficha de Google de tu negocio. Debajo, lo que lo hace funcionar, montado a tu medida: automatizaciones, asistentes con IA y programas de gestión.",
    "Primero nos cuentas qué quieres mejorar y miramos cómo trabajas. Luego te damos una propuesta por escrito, y cada fase se paga cuando la ves funcionando.",
  ],
  especialidades: ["Web", "Tienda online", "Ficha de Google", "Automatización e IA", "Software a medida"],
  /** Junto a la cota «Superficie»: el rótulo de puerta del hero (003 §3.1, CA-15). */
  lema: "Lo que ve tu cliente",
  ctaPrincipal: "Pedir una propuesta",
  ctaSecundario: "Ver qué hay debajo",
} as const;

export interface Problema {
  numero: string;
  titulo: string;
  texto: string;
}

export const problemas = {
  titulo: "¿Te pasa alguna de estas?",
  items: [
    {
      numero: "01",
      titulo: "Si copias a mano lo mismo en varios sitios.",
      texto: "Facturas, presupuestos o registros: si el mismo dato se escribe a mano en varios sitios, se puede conectar para que se escriba solo.",
    },
    {
      numero: "02",
      titulo: "Si te escriben cuando no puedes contestar.",
      texto: "Fuera de horario o con las manos ocupadas: un asistente en tu web puede contestar lo de siempre, recoger el contacto y pasarte lo demás.",
    },
    {
      numero: "03",
      titulo: "Si usas programas que no se hablan entre ellos.",
      texto: "La agenda por un lado y las facturas por otro: se pueden conectar para que lo que entra en uno llegue al otro.",
    },
  ] satisfies Problema[],
  cierre: "Eso es lo de abajo. Si te pasa alguna, miramos tu caso y te decimos qué se puede montar.",
} as const;

/**
 * Las cuatro líneas, pintadas como los pozos de la portada anterior (`Servicios`): cada una
 * con su nombre, una descripción en la lengua del cliente y 4 o 5 cosas que ya se saben
 * hacer. Nada que no se haya montado nunca (ni voz por teléfono ni foto y vídeo aquí).
 */
export const servicios = {
  titulo: "Cuatro líneas de trabajo.",
  em: "Una parte se ve, otra trabaja debajo.",
  intro:
    "Cada línea tiene una parte que ve tu cliente y otra que trabaja por debajo.",
  lineas: [
    {
      numero: "01",
      nombre: "IA y automatización de procesos",
      descripcion:
        "Si algo se hace a mano y se repite, podemos montar que funcione solo mientras tú atiendes: conectar los programas que uses y meter IA solo donde ahorre trabajo de verdad.",
      incluye: [
        "Lectura de facturas",
        "Presupuestos en un clic",
        "Programas conectados",
        "Informes y avisos automáticos",
      ],
      enlace: { href: "/#soluciones", label: "Ver ejemplos" },
    },
    {
      numero: "02",
      nombre: "Agentes y asistentes con IA",
      descripcion:
        "Un asistente en tu web que contesta lo de siempre, recoge el contacto y te pasa la conversación cuando no sabe. Y, a tu medida, podemos montarlo también en WhatsApp, con tus datos reales y solo con lo que le dejes hacer.",
      incluye: ["Asistente en tu web", "Agente de WhatsApp", "Reservas y citas", "Primer contacto con clientes, a tu medida", "Paso a una persona"],
      enlace: { href: "/#soluciones", label: "Ver un ejemplo" },
    },
    {
      numero: "03",
      nombre: "Software a medida",
      descripcion:
        "Si ningún programa encaja con cómo trabajas, podemos escribirlo para ti: un panel, una agenda o la gestión de pedidos, para llevarlo desde el móvil. El código queda en un repositorio a tu nombre.",
      incluye: ["Paneles de gestión", "Pedidos e inventario", "Reservas y agenda", "Conexión con lo que ya tienes"],
    },
    {
      numero: "04",
      nombre: "Web y tienda online",
      descripcion:
        "Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Rápida, a tu nombre y preparada para que te encuentren en Google. Y si quieres vender por internet, la tienda online.",
      incluye: [
        "Diseño a medida, sin constructores",
        "Tienda online",
        "Ficha de Google y SEO local",
        "Formulario de contacto",
        "Mantenimiento",
        "Reservas a tu medida",
      ],
      enlace: { href: "/plantillas/", label: "Ver plantillas" },
    },
  ],
} as const;

export type Maqueta = "whatsapp" | "factura" | "voz" | "embudo" | "panel" | "citas";

export interface Caso {
  numero: string;
  titulo: string;
  texto: string;
  ideal: string;
  maqueta: Maqueta;
}

export const soluciones = {
  titulo: "Tecnología aplicada",
  em: "a problemas habituales.",
  intro: "Descubre algunas de las soluciones que podemos construir para tu negocio.",
  aviso:
    "Son ejemplos de lo que se puede montar, con datos inventados. No son clientes ni resultados medidos.",
  casos: [
    {
      numero: "01",
      titulo: "Que se conteste aunque estés con otro cliente",
      texto: "Un asistente en tu web, y si lo quieres también en WhatsApp, que responda lo de siempre, recoja los datos y te deje la consulta ordenada.",
      ideal: "Para alojamientos, clínicas y empresas de servicios.",
      maqueta: "whatsapp",
    },
    {
      numero: "02",
      titulo: "Que la factura se apunte sola",
      texto: "Podemos montar que se lea cada factura que te llega, se saquen proveedor, fecha e importe y quede clasificada donde la necesites.",
      ideal: "Para asesorías, comercios y negocios pequeños.",
      maqueta: "factura",
    },
    {
      numero: "03",
      titulo: "Las cuentas, con un audio",
      texto: "Podemos montar que digas lo que has vendido en un mensaje de voz y quede apuntado, y que luego lo preguntes igual.",
      ideal: "Para autónomos y pequeños negocios.",
      maqueta: "voz",
    },
    {
      numero: "04",
      titulo: "Que las citas se pidan y se recuerden solas",
      texto: "Podemos montar una agenda en la que tu cliente vea los huecos libres y reserve, y que le mande la confirmación y un recordatorio el día antes.",
      ideal: "Para clínicas, alojamientos y empresas de servicios.",
      maqueta: "citas",
    },
  ] satisfies Caso[],
} as const;

export interface Proyecto {
  nombre: string;
  texto: string;
  href: string;
  etiqueta: string;
}

export interface CategoriaProyectos {
  clave: "webs" | "automatizacion" | "software";
  titulo: string;
  intro: string;
  /** Solo la de webs: las plantillas salen de `plantillas.ts`. */
  conPlantillas?: boolean;
  items: Proyecto[];
}

export const proyectos = {
  titulo: "Webs de ejemplo por sector",
  em: "y lo que ya funciona.",
  aviso:
    "Nada de esto es trabajo para un cliente. Los negocios de estas webs son inventados, y la tienda, el informe y el formulario los hemos construido nosotros y se enseñan con datos de ejemplo.",
  categorias: [
    {
      clave: "webs",
      titulo: "Plantillas por sector",
      intro: "Webs terminadas de negocios inventados, con todo su contenido, para ver cómo quedaría la de tu negocio.",
      conPlantillas: true,
      items: [],
    },
    {
      clave: "automatizacion",
      titulo: "Para la web que ya tienes",
      intro: "Funcionan hoy: el informe mide la web que tú nos digas, y el formulario recibe y guarda los mensajes esté donde esté alojada tu web.",
      items: [
        {
          nombre: "Informe de mejoras de tu web",
          texto: "Mide tu web, lee sus textos y ordena los fallos por prioridad, cada fallo con su prueba.",
          href: "/herramientas/#informe",
          etiqueta: "Informe",
        },
        {
          nombre: "Formulario de contacto",
          texto: "Recibe y guarda cada mensaje de tu web, sin el formulario de otra empresa incrustado, esté donde esté tu web.",
          href: "/herramientas/#formularios",
          etiqueta: "Formulario",
        },
      ],
    },
    {
      clave: "software",
      titulo: "Para vender por internet",
      intro: "Una tienda en tu dominio, que cobra con tarjeta y Bizum y que llevas desde el móvil.",
      items: [
        {
          nombre: "Tienda online",
          texto: "Catálogo, cobro y recogida en tienda listos el primer día, y un panel que avisa de qué reponer.",
          href: "/herramientas/#tiendas",
          etiqueta: "Tienda",
        },
      ],
    },
  ] satisfies CategoriaProyectos[],
} as const;

export const quien = {
  titulo: "Dos personas,",
  em: "sin intermediarios.",
  texto:
    "Somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien hace el trabajo.",
  personas: {
    Álvaro: {
      rol: "Web, código y automatización",
      texto:
        "Diseña y programa las webs y las tiendas, y monta las automatizaciones con IA que se encargan a medida. Si algo del código no te encaja, se lo dices a él.",
    },
    Yanin: {
      rol: "Foto, vídeo y redes",
      texto: "Hace y edita las fotos y los vídeos del estudio.",
    },
  } as Record<string, { rol: string; texto: string }>,
} as const;

export interface Pregunta {
  pregunta: string;
  respuesta: string[];
}

export const faq = {
  titulo: "Preguntas",
  em: "frecuentes.",
  items: [
    {
      pregunta: "¿Necesito cambiar los programas que ya utilizo?",
      respuesta: [
        "En general, no. Si usas correo, calendario, hojas de cálculo, un programa de facturación o un CRM, lo normal es conectarlo a lo que montemos.",
        "Si algún programa no se puede conectar, te lo decimos en la propuesta y te proponemos otra cosa. No cambiamos nada sin que lo decidas tú.",
      ],
    },
    {
      pregunta: "¿Necesito conocimientos técnicos?",
      respuesta: [
        "No. La parte técnica la hacemos nosotros. Al ponerlo en marcha te enseñamos a usarlo, y debería resultarte tan cotidiano como mandar un mensaje.",
      ],
    },
    {
      pregunta: "¿Cuánto cuesta?",
      respuesta: [
        "Depende de lo que haya que montar: una web no es lo mismo que una aplicación de gestión. Por eso no publicamos una tabla de precios.",
        "Después de hablar contigo te damos la propuesta por escrito, con el alcance y el precio de cada fase, antes de empezar nada. Cada fase se paga cuando la ves funcionando.",
      ],
    },
    {
      pregunta: "¿Cuánto tiempo se tarda?",
      respuesta: [
        "Trabajamos por fases y empezamos por lo que más te importa: lo primero que funciona suele estar en semanas. El resto se va sumando.",
        "Un plazo cerrado para todo no te lo damos sin conocer el caso: una automatización sencilla y un sistema de gestión completo no se miden igual. En la propuesta va qué llega en cada fase.",
      ],
    },
    {
      pregunta: "¿Hay costes mensuales?",
      respuesta: [
        "Puede haberlos, según lo que se monte. Algunas piezas de terceros se pagan por uso o por cuota (la inteligencia artificial, la mensajería de WhatsApp, el alojamiento), y en la tienda online la plataforma cobra comisión por venta.",
        "En la propuesta separamos lo que se paga una vez de lo que se paga cada mes, y a nombre de quién va cada cuota.",
      ],
    },
    {
      pregunta: "¿La IA puede cometer errores?",
      respuesta: [
        "Sí, y no te vamos a prometer lo contrario. Por eso, cuando la montamos, no la dejamos suelta: limitamos qué puede hacer y a qué datos llega, hacemos que consulte información real en vez de inventarla, que te pase a una persona cuando no sabe y que deje un registro de lo que ha hecho para que lo revises.",
        "El objetivo es que, cuando se equivoque, se note pronto y cueste poco arreglarlo.",
      ],
    },
  ] satisfies Pregunta[],
} as const;

export const contacto = {
  titulo: "¿Y si tu negocio pudiera",
  em: "trabajar de otra manera?",
  texto:
    "Cuéntanos a qué te dedicas y qué te gustaría mejorar. Lo leemos, hablamos contigo y te damos una propuesta por escrito con lo que tenga sentido para tu negocio.",
  cta: "Pedir una propuesta",
  tipos: [
    "Alojamiento u hostelería",
    "Clínica o salud",
    "Asesoría o despacho",
    "Comercio o tienda",
    "Inmobiliaria",
    "Servicios profesionales",
    "Otro",
  ],
} as const;
