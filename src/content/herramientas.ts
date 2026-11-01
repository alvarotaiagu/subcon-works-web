export interface Captura {
  /** En public/herramientas/. Siempre con WorkImage o BrowserMockup, que añaden el basePath. */
  src: string;
  alt: string;
  /** Escritorio en marco de navegador, o vertical en marco de móvil. */
  marco: "navegador" | "movil";
}

export interface Herramienta {
  /** Ancla en /herramientas/. Los servicios de la portada enlazan aquí. */
  id: string;
  nombre: string;
  /** Qué le resuelve al dueño, en una línea. */
  resuelve: string;
  /** De tres a cinco cosas que hace. */
  hace: string[];
  /** Lo que sostiene: los servicios de la portada (o la auditoría) que se apoyan en ella. */
  sostiene: { nombre: string; href: string }[];
  capturas?: Captura[];
  /** Para las que no tienen captura: el icono de su servicio. */
  icono?: string;
  /** Solo la principal: el bloque de ventajas con título propio. */
  ventajas?: { titulo: string; items: { titulo: string; texto: string }[] };
}

/**
 * Software propio del estudio, una pieza por servicio. Solo lo que existe y
 * funciona hoy, contado como capacidad: nada de prospección (demos en serie,
 * envíos, reparto de leads), ni condiciones («sin comisiones», «sin cuotas»),
 * ni cifras de clientes. La plataforma de tiendas cobra comisión por venta,
 * no emite facturas y no escribe fichas desde una foto: no se dice lo
 * contrario en ningún sitio.
 */
export const herramientas: Herramienta[] = [
  {
    id: "tiendas",
    nombre: "Tienda online",
    resuelve:
      "Vender por internet sin montar ni aprender una tienda: te la damos funcionando y la llevas desde el móvil.",
    hace: [
      "Catálogo, cobro y recogida en tienda listos el primer día",
      "Panel pensado para el móvil",
      "Avisos de qué reponer",
    ],
    sostiene: [{ nombre: "Tienda online", href: "/#servicios" }],
    capturas: [
      {
        src: "/herramientas/tienda-escaparate.jpg",
        alt: "Novedades de una papelería de ejemplo hecha con la plataforma, en el ordenador.",
        marco: "navegador",
      },
      {
        src: "/herramientas/tienda-panel-movil.jpg",
        alt: "Inicio del panel de la tienda de ejemplo en un móvil: ventas de la semana y la lista «Para hacer» con lo que toca reponer.",
        marco: "movil",
      },
    ],
    ventajas: {
      titulo: "Montada por nosotros, llevada por ti",
      items: [
        {
          titulo: "Abre vendiendo, no configurando",
          texto:
            "Subimos el catálogo con sus fotos, tallas y precios, conectamos el cobro, decidimos contigo los envíos y la recogida y la ponemos en tu dominio.",
        },
        {
          titulo: "Vende como un comercio de aquí",
          texto:
            "Cobra con tarjeta y Bizum, y tu cliente puede recoger en tienda. Si quieres reparto en tu pueblo o pedidos por WhatsApp o por teléfono con enlace de pago, podemos montarlo.",
        },
        {
          titulo: "Se lleva desde el móvil",
          texto:
            "Subir un producto, ocultar lo agotado o marcar un pedido como enviado se hace desde el teléfono, sin encender el ordenador.",
        },
        {
          titulo: "Te avisa de qué reponer",
          texto:
            "«Repón la M del vestido de lino.» Avisos así, en tu panel.",
        },
        {
          titulo: "Con la cara de tu tienda",
          texto: "Diseño a medida a partir de tu marca.",
        },
        {
          titulo: "También en Instagram, Facebook y Google Shopping, a medida",
          texto:
            "Podemos conectar tu catálogo a Instagram, Facebook y Google Shopping, para que quien vea un producto allí entre a comprarlo en tu tienda.",
        },
        {
          titulo: "Lo legal, hecho",
          texto:
            "Aviso legal, privacidad, condiciones y envíos.",
        },
        {
          titulo: "Alguien detrás que la conoce",
          texto:
            "Cuando preguntas, te contesta quien la ha hecho.",
        },
        {
          titulo: "Encaja con lo demás",
          texto:
            "Si te llevamos también la ficha de Google o el correo a tus clientes, podemos montarlos sobre la misma tienda.",
        },
      ],
    },
  },
  {
    id: "informe",
    nombre: "Informe de mejoras de tu web",
    resuelve: "Saber qué falla en tu web y qué arreglar primero, con pruebas y no con opiniones.",
    hace: [
      "Mide velocidad, accesibilidad y cómo se ve en el móvil con un navegador de verdad",
      "Lee los textos de la portada y de las páginas de dentro",
      "Cada fallo trae su prueba: la medida, la frase exacta o la captura",
      "Lo que no se puede probar se descarta o se marca como sospecha",
      "Ordena los fallos por prioridad: alta, media o baja",
    ],
    sostiene: [
      { nombre: "Diseño y desarrollo web", href: "/#servicios" },
    ],
    capturas: [
      {
        src: "/herramientas/informe.jpg",
        alt: "Informe de mejoras sobre la demo de una de nuestras plantillas, con los fallos y su prueba.",
        marco: "navegador",
      },
    ],
  },
  {
    id: "formularios",
    nombre: "Formulario de contacto",
    resuelve: "Que cada mensaje de tu web se reciba y se guarde, sin un formulario de otra empresa incrustado.",
    hace: [
      "El código que recibe cada mensaje lo hemos escrito nosotros",
      "Funciona igual esté la web donde esté alojada",
    ],
    sostiene: [{ nombre: "Diseño y desarrollo web", href: "/#servicios" }],
    icono: "/servicios/web.svg",
  },
];
