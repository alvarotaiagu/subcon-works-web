export interface Trabajo {
  slug: string;
  cliente: string;
  sector: string;
  año: number;
  nota: string;
  etiquetas: [string, string, string];
  problema: string;
  solucion: string;
  imagenPortada: string;
  capturas: string[];
  /** [PENDIENTE] enlace al sitio real — completar antes de publicar en serio. */
  enlaceReal: string | null;
}

export const trabajos: Trabajo[] = [
  {
    slug: "oito",
    cliente: "Oito",
    sector: "Bar de desayunos, Carballo",
    año: 2026,
    nota: "Rediseño completo",
    etiquetas: ["Rediseño", "Carta digital", "Rendimiento"],
    problema:
      "La web anterior no reflejaba el sitio real: cargaba lento, la carta estaba en un PDF y no se veía bien en el móvil, que es desde donde entra casi todo el mundo.",
    solucion:
      "Rediseño completo centrado en la carta y el ambiente del local, con una versión para móvil pensada primero para eso, no adaptada después.",
    imagenPortada: "/work/oito-portada.svg",
    capturas: ["/work/oito-1.svg", "/work/oito-2.svg"],
    enlaceReal: null,
  },
  {
    slug: "marabu",
    cliente: "Marabú",
    sector: "Cervecería y cocktail bar, Carballo",
    año: 2026,
    nota: "Web desde cero",
    etiquetas: ["Web desde cero", "Identidad visual", "Reservas"],
    problema:
      "No tenían web: solo redes sociales, con la carta y los horarios repartidos entre publicaciones antiguas y difíciles de encontrar.",
    solucion:
      "Web desde cero con una identidad visual propia que separa el día de la noche del local, y toda la información que antes había que buscar en redes ahora está en un único sitio.",
    imagenPortada: "/work/marabu-portada.svg",
    capturas: ["/work/marabu-1.svg", "/work/marabu-2.svg"],
    enlaceReal: null,
  },
  {
    slug: "carty",
    cliente: "Carty",
    sector: "Cafetería histórica desde 1968, Carballo",
    año: 2026,
    nota: "Web desde cero",
    etiquetas: ["Web desde cero", "Historia de marca", "SEO local"],
    problema:
      "Más de 50 años de historia sin ninguna presencia digital que lo contara, y clientes que buscaban el negocio en internet sin encontrarlo.",
    solucion:
      "Web desde cero que pone la historia del local por delante y deja la información práctica —horarios, ubicación, carta— a un clic, con el SEO local resuelto desde el primer día.",
    imagenPortada: "/work/carty-portada.svg",
    capturas: ["/work/carty-1.svg", "/work/carty-2.svg"],
    enlaceReal: null,
  },
  {
    slug: "taberna-do-rio",
    cliente: "A Taberna do Río",
    sector: "Taberna tradicional junto al Anllóns",
    año: 2026,
    nota: "Web desde cero",
    etiquetas: ["Web desde cero", "Galería", "Ubicación"],
    problema:
      "Un local con una ubicación privilegiada junto al río que no se transmitía en ningún sitio: no había forma de enseñarlo antes de ir.",
    solucion:
      "Web desde cero que apuesta por la galería y la ubicación como argumento principal, con un mapa y unos horarios siempre actualizados.",
    imagenPortada: "/work/taberna-do-rio-portada.svg",
    capturas: ["/work/taberna-do-rio-1.svg", "/work/taberna-do-rio-2.svg"],
    enlaceReal: null,
  },
];
