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
    nombre: "Plataforma de tiendas",
    resuelve:
      "Vender por internet sin montar ni aprender una tienda: te la damos funcionando y la llevas desde el móvil.",
    hace: [
      "Catálogo, cobro y envíos listos el primer día",
      "Panel pensado para el móvil",
      "Avisos de qué reponer y qué no se vende",
      "Catálogo sincronizado con Instagram, Facebook y Google Shopping",
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
            "Bizum, recogida en tienda, reparto en tu pueblo por código postal y pedidos por WhatsApp o por teléfono, que cobras con un enlace de pago o en mano.",
        },
        {
          titulo: "Se lleva desde el móvil",
          texto:
            "Subir un producto, ocultar lo agotado o marcar un pedido como enviado se hace desde el teléfono, sin encender el ordenador.",
        },
        {
          titulo: "Te dice qué hacer, no te enseña gráficas",
          texto:
            "«Repón la M del vestido de lino.» «Esto se mira mucho y no se vende.» Avisos así, y un resumen cada semana en tu correo.",
        },
        {
          titulo: "Con la cara de tu tienda",
          texto: "Diseño propio a partir de tu marca, no un tema que comparten otras tiendas.",
        },
        {
          titulo: "Tu escaparate en Instagram, Facebook y Google Shopping",
          texto:
            "El catálogo se sincroniza solo, y quien ve un producto allí entra a comprarlo en tu tienda.",
        },
        {
          titulo: "Lo legal, hecho",
          texto:
            "Aviso legal, privacidad, condiciones, envíos y el botón de desistir que exige la ley desde junio de 2026. Sin banner de cookies, porque las estadísticas no las usan.",
        },
        {
          titulo: "Alguien detrás que la conoce",
          texto:
            "Si un cobro o un aviso falla, la alerta nos llega a nosotros. Y cuando preguntas, te contesta quien la ha hecho.",
        },
        {
          titulo: "Encaja con lo demás",
          texto:
            "Las fichas de producto, la ficha de Google y el correo a tus clientes trabajan sobre la misma tienda.",
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
      { nombre: "La auditoría gratuita", href: "/#contacto" },
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
    id: "vigilancia",
    nombre: "Vigilancia diaria",
    resuelve: "Que si tu web se cae nos enteremos nosotros antes que tus clientes.",
    hace: [
      "Comprueba cada día que la web responde y abre por https",
      "Avisa dos semanas antes de que caduque el certificado",
      "Avisa un mes antes de que caduque el dominio",
      "Detecta si el dominio deja de apuntar a tu web",
      "Comprueba que el servicio del formulario de contacto sigue en pie",
    ],
    sostiene: [{ nombre: "Mantenimiento y soporte", href: "/#servicios" }],
    icono: "/servicios/mantenimiento.svg",
  },
  {
    id: "ficha-google",
    nombre: "Auditoría de la ficha de Google",
    resuelve: "Que lo que dice Google de tu negocio coincida con lo que dice tu web.",
    hace: [
      "Compara nombre, teléfono y dirección con los de tu web",
      "Revisa la web enlazada, el horario y el estado de la ficha",
      "Sigue la valoración y las reseñas para ver si suben o bajan",
      "Deja los cambios escritos, listos para pegar en la ficha",
    ],
    sostiene: [{ nombre: "Aparecer en Google", href: "/#servicios" }],
    icono: "/servicios/google.svg",
  },
  {
    id: "formularios",
    nombre: "Formularios de contacto propios",
    resuelve: "Que los mensajes de tu web te lleguen a ti, sin un formulario de otra empresa incrustado.",
    hace: [
      "El código que recibe cada mensaje lo hemos escrito nosotros",
      "Te llega el aviso a tu correo y quien escribe recibe su confirmación",
      "Funciona igual esté la web donde esté alojada",
    ],
    sostiene: [{ nombre: "Diseño y desarrollo web", href: "/#servicios" }],
    icono: "/servicios/web.svg",
  },
];
