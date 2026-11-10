/**
 * Los trabajos que enseña la web: encargos de clientes reales y estudios propios.
 *
 * Sustituye al catálogo de las 30 plantillas ficticias (ya no se enseña). Lo único que
 * importa es que cada pieza diga lo que es:
 *
 * - `encargo`: una web hecha para un negocio real, con su nombre y su dirección.
 * - `estudio`: un proyecto propio, sin cliente. Su negocio es inventado y la web lo dice.
 *
 * El orden es el de la lista y lo decide Álvaro, no el origen: hoy van primero los estudios
 * propios y después los encargos. Cuando entre otro cliente, se añade a esta lista y ya sale.
 *
 * Sin imports, para que los tests de Node lo carguen tal cual.
 */

export type TipoTrabajo = "encargo" | "estudio";

export interface Trabajo {
  /** Identificador estable. También lo usan las páginas de sector (`sectores.ts`). */
  slug: string;
  /** Nombre del fichero en `public/trabajos/` (sin extensión). Dos entradas pueden compartirlo. */
  imagen: string;
  /** El negocio. En un estudio es inventado. */
  negocio: string;
  ciudad: string;
  sector: string;
  tipo: TipoTrabajo;
  /** Solo en un encargo cuya web aún no está en producción: «Propuesta de rediseño». */
  estado?: string;
  /** El concepto que ordena la web, en una línea: «Nombre»: explicación. */
  concepto: string;
  /** Qué se mueve o qué hace: lo que se ve al pasar el ratón por la tarjeta. */
  movimiento: string;
  /** Dirección real a la que lleva la tarjeta. */
  url: string;
}

export const etiquetaTipo: Record<TipoTrabajo, string> = {
  encargo: "Encargo",
  estudio: "Estudio propio",
};

export const trabajos: Trabajo[] = [
  {
    slug: "balda",
    imagen: "balda",
    negocio: "Balda",
    ciudad: "Tienda ficticia",
    sector: "Zapatillas",
    tipo: "estudio",
    concepto: "«Pared»: toda la tienda es una pared con diez zapatillas en 3D, sin secciones debajo.",
    movimiento:
      "La cámara se acerca por la pared hasta la zapatilla que pulsas y se puede girar con el ratón. Sin tarjeta gráfica sale una imagen fija con los mismos botones.",
    url: "https://alvarotaiagu.github.io/balda-zapatillas-web/",
  },
  {
    slug: "norte",
    imagen: "norte",
    negocio: "Norte",
    ciudad: "Tienda ficticia",
    sector: "Chaquetas",
    tipo: "estudio",
    concepto: "«Luz de norte»: una sala, un perchero y la luz suave de ventana. Las fotos son de IA.",
    movimiento:
      "Cada foto está partida en capas: la chaqueta de delante se mece sobre su gancho, gira y paralaje con el ratón; la cámara da un paso cuando cambias de prenda.",
    url: "https://alvarotaiagu.github.io/perchero-chaquetas-web/",
  },
  {
    slug: "casa-da-corga",
    imagen: "casa-da-corga",
    negocio: "Casa da Corga",
    ciudad: "Ribeira Sacra",
    sector: "Casa rural ficticia · 3D completa",
    tipo: "estudio",
    concepto:
      "«Cámara sobre raíl»: el scroll no cambia de sección, mueve una cámara que entra volando por el cañón del Sil.",
    movimiento:
      "Relieve y ortofoto reales del IGN, y el sol y la luna donde estarían ese día. La casa se levanta piedra a piedra mientras la rodeas.",
    url: "https://alvarotaiagu.github.io/plantilla-casa-rural-mundo-web/",
  },
  {
    slug: "casa-da-corga-ligera",
    imagen: "casa-da-corga",
    negocio: "Casa da Corga",
    ciudad: "Ribeira Sacra",
    sector: "Casa rural ficticia · versión ligera",
    tipo: "estudio",
    concepto:
      "«Cámara sobre raíl», aligerada: el mismo recorrido con menos peso para móviles y equipos sin tarjeta gráfica.",
    movimiento:
      "Misma escena con el 3D simplificado: sombras a menor ritmo y árboles lejanos sencillos. Se abre con `?ligera`.",
    url: "https://alvarotaiagu.github.io/plantilla-casa-rural-mundo-web/?ligera",
  },
  {
    slug: "marina-spa",
    imagen: "marina-spa",
    negocio: "Marina Spa",
    ciudad: "Zafra",
    sector: "Centro de estética",
    tipo: "encargo",
    estado: "Nueva versión",
    concepto:
      "«Bóveda»: el centro está bajo bóvedas de ladrillo y su marca es un loto dorado; la web es entrar ahí.",
    movimiento:
      "El loto de su logo se dibuja, se enciende y vuela al arco de la portada; las fotos entran en arcos de medio punto que se trazan mientras se enfocan.",
    url: "https://alvarotaiagu.github.io/marina-spa-zafra-web/",
  },
  {
    slug: "pazo-do-souto",
    imagen: "pazo-do-souto",
    negocio: "Pazo do Souto",
    ciudad: "Sísamo, Carballo",
    sector: "Hotel y celebraciones",
    tipo: "encargo",
    concepto: "«Sello y portón»: el logo se traza como un sello y la entrada es un portón que se abre.",
    movimiento:
      "Un sello que se dibuja y un portón en 3D que se abre y deja ver la finca del siglo XVII.",
    url: "https://pazodosouto.es",
  },
  {
    slug: "apartamentos-el-sotano",
    imagen: "apartamentos-el-sotano",
    negocio: "Apartamentos El Sótano",
    ciudad: "Badajoz",
    sector: "Apartamentos turísticos",
    tipo: "encargo",
    concepto: "«Los cuatro listones»: el marco de madera de su rótulo ordena toda la web.",
    movimiento:
      "Una placa que se abre como ventana sobre el patio, y un radar de Badajoz a pie con las distancias medidas sobre el callejero real. En castellano y portugués.",
    url: "https://apartamentoselsotano.es",
  },
];

/** Los trabajos con esos slugs, en el orden de la lista; los que no existen se saltan. */
export function trabajosPorSlug(slugs: readonly string[]): Trabajo[] {
  return slugs.flatMap((slug) => trabajos.filter((t) => t.slug === slug));
}
