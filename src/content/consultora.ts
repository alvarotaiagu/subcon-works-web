/**
 * Textos de la versión «consultora tecnológica» de la portada (rama `exp/consultora`,
 * experimento para comparar con la portada vigente). Sin imports, como `portada.ts`.
 *
 * Reglas que se mantienen de la web vigente: nada de clientes, cifras de ahorro, plazos
 * ni precios inventados; los ejemplos van siempre rotulados «Ejemplo» (D-019); lo que se
 * enseña en «Proyectos» es lo que existe de verdad en este repo (plantillas ficticias y
 * herramientas propias de `herramientas.ts`).
 */

export const hero = {
  linea1: "Lo de arriba vende.",
  linea2: "Lo de abajo",
  linea2em: "trabaja.",
  /** Los dos párrafos bajo el titular. */
  parrafos: [
    "Arriba está lo que ve tu cliente: la web, el WhatsApp, la atención. Debajo, lo que lo hace funcionar: facturas, citas, avisos y datos que se mueven solos.",
    "Primero miramos dónde se te van las horas. Luego montamos lo que te las devuelve, con los programas que ya usas y a tu nombre.",
  ],
  especialidades: ["IA", "Automatización", "Software a medida", "Desarrollo web"],
  /** Junto a la cota «Superficie»: qué es el estudio, dicho en una línea. */
  lema: "Consultoría de IA y automatización",
  ctaPrincipal: "Solicitar diagnóstico gratuito",
  ctaSecundario: "Ver qué hay debajo",
} as const;

export interface Problema {
  numero: string;
  titulo: string;
  texto: string;
}

export const problemas = {
  titulo: "¿Cuánto tiempo pierde tu negocio en tareas que podrían hacerse solas?",
  items: [
    {
      numero: "01",
      titulo: "Copias datos de un programa a otro.",
      texto: "Facturas, presupuestos, registros: el mismo dato escrito tres veces, a mano.",
    },
    {
      numero: "02",
      titulo: "Los mensajes llegan cuando no puedes contestar.",
      texto: "Consultas fuera de horario, WhatsApps sin responder y clientes que acaban en otro sitio.",
    },
    {
      numero: "03",
      titulo: "Tus programas no se hablan entre ellos.",
      texto: "El calendario por un lado, las facturas por otro y una hoja de cálculo en medio.",
    },
  ] satisfies Problema[],
  cierre: "Eso es lo de abajo. Lo encontramos y lo montamos para que trabaje solo.",
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
    "Cada línea tiene una parte que ve tu cliente y otra que trabaja por debajo. Se contratan por separado o juntas.",
  lineas: [
    {
      numero: "01",
      nombre: "IA y automatización de procesos",
      descripcion:
        "Lo que hoy copias de un sitio a otro a mano, funcionando solo mientras tú atiendes. Conectamos los programas que ya usas y metemos IA solo donde ahorra trabajo de verdad.",
      incluye: [
        "Facturas que se leen solas",
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
        "Contesta en tu web y en WhatsApp cuando tú no puedes, mira tus datos reales en vez de inventar y te pasa la conversación cuando no sabe. Hace solo lo que le dejes hacer.",
      incluye: ["Asistente en tu web", "Agente de WhatsApp", "Reservas y citas", "Primer contacto con clientes", "Paso a una persona"],
      enlace: { href: "/#soluciones", label: "Ver un agente en acción" },
    },
    {
      numero: "03",
      nombre: "Software a medida",
      descripcion:
        "Cuando ningún programa encaja con cómo trabajas, lo escribimos para ti: un panel, una agenda o la gestión de pedidos, que llevas desde el móvil. El código, en un repositorio a tu nombre.",
      incluye: ["Paneles de gestión", "Pedidos e inventario", "Reservas y agenda", "Conexión con lo que ya tienes"],
      enlace: { href: "/herramientas/#tiendas", label: "Ver nuestro software" },
    },
    {
      numero: "04",
      nombre: "Web y tienda online",
      descripcion:
        "Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Rápida, tuya y preparada para que te encuentren en Google a dos calles de distancia.",
      incluye: ["Diseño propio, sin constructores", "Tienda online", "Ficha de Google y SEO local", "Formularios y reservas", "Mantenimiento"],
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
  em: "a problemas reales.",
  intro: "Descubre algunas de las soluciones que podemos construir para tu negocio.",
  aviso:
    "Son ejemplos de lo que se puede montar, con datos inventados. No son clientes ni resultados medidos.",
  casos: [
    {
      numero: "01",
      titulo: "Contesta aunque estés con otro cliente",
      texto: "Un agente en tu web y en WhatsApp que responde lo de siempre, recoge los datos y te deja la consulta ordenada.",
      ideal: "Para alojamientos, clínicas y empresas de servicios.",
      maqueta: "whatsapp",
    },
    {
      numero: "02",
      titulo: "La factura llega y se apunta sola",
      texto: "Lee la factura, saca proveedor, fecha e importe, y la deja clasificada donde la busca tu gestoría.",
      ideal: "Para asesorías, comercios y pymes.",
      maqueta: "factura",
    },
    {
      numero: "03",
      titulo: "Las cuentas, con un audio",
      texto: "Dices «vendí tres cajas a 40 euros» en un mensaje de voz y queda apuntado. Luego lo preguntas igual.",
      ideal: "Para autónomos y pequeños negocios.",
      maqueta: "voz",
    },
    {
      numero: "04",
      titulo: "Citas que se piden y se recuerdan solas",
      texto: "El cliente ve los huecos libres, reserva, recibe la confirmación y un recordatorio el día antes.",
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
  titulo: "Ideas que se convierten",
  em: "en soluciones.",
  aviso:
    "Nada de esto es un trabajo de cliente. Las plantillas son webs de negocios inventados y las herramientas son software propio del estudio, que se enseña funcionando con datos de ejemplo.",
  categorias: [
    {
      clave: "webs",
      titulo: "Webs y ecommerce",
      intro: "Plantillas de web terminadas, con contenido de verdad, para ver cómo queda un negocio de tu sector.",
      conPlantillas: true,
      items: [
        {
          nombre: "Formularios de contacto propios",
          texto: "Los mensajes de tu web te llegan a ti, sin un formulario de otra empresa incrustado.",
          href: "/herramientas/#formularios",
          etiqueta: "Herramienta propia",
        },
      ],
    },
    {
      clave: "automatizacion",
      titulo: "Automatizaciones e inteligencia artificial",
      intro: "Lo que ya funciona por debajo: informes con pruebas, vigilancia diaria y comprobaciones automáticas.",
      items: [
        {
          nombre: "Informe de mejoras de tu web",
          texto: "Mide, lee y ordena los fallos de tu web por prioridad, cada uno con su prueba.",
          href: "/herramientas/#informe",
          etiqueta: "Herramienta propia",
        },
        {
          nombre: "Vigilancia diaria",
          texto: "Si tu web se cae o caduca algo, nos enteramos nosotros antes que tus clientes.",
          href: "/herramientas/#vigilancia",
          etiqueta: "Herramienta propia",
        },
        {
          nombre: "Auditoría de la ficha de Google",
          texto: "Compara lo que dice Google de tu negocio con lo que dice tu web.",
          href: "/herramientas/#ficha-google",
          etiqueta: "Herramienta propia",
        },
      ],
    },
    {
      clave: "software",
      titulo: "Software y aplicaciones",
      intro: "Una plataforma completa con panel de gestión pensado para llevarla desde el móvil.",
      items: [
        {
          nombre: "Plataforma de tiendas",
          texto: "Catálogo, cobro y envíos listos el primer día, y un panel que avisa de qué reponer.",
          href: "/herramientas/#tiendas",
          etiqueta: "Software propio",
        },
      ],
    },
  ] satisfies CategoriaProyectos[],
} as const;

export const quien = {
  titulo: "Dos personas,",
  em: "sin intermediarios.",
  texto:
    "Somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien monta tu automatización, escribe el código o graba tu vídeo.",
  personas: {
    Álvaro: {
      rol: "Desarrollo, IA y automatización",
      texto:
        "Diseño y desarrollo de webs, aplicaciones y sistemas empresariales. Especializado en conectar tecnología, automatizar procesos y construir soluciones adaptadas a cada negocio.",
    },
    Yanin: {
      rol: "Diseño y contenido audiovisual",
      texto:
        "Fotografía, vídeo y creación de contenido visual para ayudar a las marcas a comunicar mejor y mejorar su presencia digital.",
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
        "En general, no. Lo normal es conectar lo que ya usas: el correo, el calendario, las hojas de cálculo, tu programa de facturación o tu CRM.",
        "Si alguna herramienta no se puede conectar, te lo decimos en el diagnóstico y te proponemos una alternativa. No cambiamos nada sin que lo decidas tú.",
      ],
    },
    {
      pregunta: "¿Necesito conocimientos técnicos?",
      respuesta: [
        "No. La parte técnica la hacemos nosotros. Al ponerlo en marcha te enseñamos a utilizarlo, y debería resultarte tan cotidiano como mandar un mensaje o abrir una hoja de cálculo.",
      ],
    },
    {
      pregunta: "¿Cuánto cuesta implementar una solución de IA?",
      respuesta: [
        "Depende de lo que haya que construir: una automatización concreta no es lo mismo que una aplicación de gestión. Por eso no publicamos una tabla de precios.",
        "Tras el diagnóstico te damos una propuesta con el alcance y el precio de cada fase por escrito, antes de empezar nada. Cada fase se paga cuando la ves funcionando.",
      ],
    },
    {
      pregunta: "¿Cuánto tiempo se tarda?",
      respuesta: [
        "Trabajamos por fases y empezamos por lo que más horas te quita: lo primero que funciona suele estar en semanas. El resto se va sumando.",
        "Un plazo cerrado para todo no te lo damos sin conocer el caso: una automatización sencilla y un sistema de gestión completo no se miden igual. En la propuesta va qué llega en cada fase.",
      ],
    },
    {
      pregunta: "¿Hay costes mensuales?",
      respuesta: [
        "Puede haberlos, según la solución. Algunas piezas de terceros se pagan por uso o por cuota (la inteligencia artificial, la mensajería de WhatsApp, el alojamiento), y el mantenimiento es opcional si prefieres que lo cuidemos nosotros.",
        "En la propuesta separamos lo que se paga una vez de lo que se paga cada mes, y a nombre de quién va cada cuota.",
      ],
    },
    {
      pregunta: "¿La IA puede cometer errores?",
      respuesta: [
        "Sí, y no te vamos a prometer lo contrario. Por eso no la dejamos suelta: limitamos qué puede hacer y a qué datos accede, hace que consulte información real en vez de inventarla, te pasa a una persona cuando no sabe, y deja un registro para que puedas revisar lo que ha hecho.",
        "El objetivo es que, cuando se equivoque, se note pronto y cueste poco arreglarlo.",
      ],
    },
  ] satisfies Pregunta[],
} as const;

export const contacto = {
  titulo: "¿Y si tu negocio pudiera",
  em: "trabajar de otra manera?",
  texto:
    "Cuéntanos qué haces, qué problemas encuentras en tu día a día y qué te gustaría mejorar. Analizaremos tu situación y te propondremos soluciones tecnológicas que tengan sentido para tu empresa.",
  cta: "Solicitar diagnóstico gratuito",
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
