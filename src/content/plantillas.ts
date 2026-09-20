export interface Plantilla {
  /** Coincide con el repo: plantilla-<slug>-web, y con /plantillas/<slug>.jpg */
  slug: string;
  /** Negocio ficticio que protagoniza la demo. Ninguno existe. */
  negocio: string;
  ciudad: string;
  sector: string;
  /** El concepto que ordena la plantilla entera, en una línea. */
  concepto: string;
  /** Qué se mueve: lo que distingue a esta plantilla de las demás. */
  movimiento: string;
  etiquetas: [string, string, string];
  demo: string;
  /** Sale en el carrusel de la portada. El resto vive en /plantillas/. */
  destacada?: boolean;
}

/**
 * Las 30 plantillas publicadas y vivas del taller (repo `plantillas-negocios-web`).
 *
 * Todas son **negocios ficticios**: nombres, datos y textos inventados, sin
 * ninguna acreditación ni registro público simulado. Se enseñan como muestra de
 * lo que se construye, no como clientes. Esa distinción se dice también en la
 * interfaz — ver el aviso de la sección Plantillas y el de /plantillas.
 */
export const plantillas: Plantilla[] = [
  {
    slug: "abogados-trinquete",
    negocio: "Ouzande Abogados",
    ciudad: "Ferrol",
    sector: "Abogacía",
    concepto:
      "«Trinquete»: la pieza que deja avanzar la rueda diente a diente y le impide volver atrás, que es exactamente lo que es un plazo.",
    movimiento:
      "Un movimiento de relojería en canvas que engrana de verdad y coge cuerda con el scroll, más una calculadora de plazos que funciona.",
    etiquetas: ["Canvas", "Calculadora", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-abogados-trinquete-web/",
    destacada: true,
  },
  {
    slug: "fotovoltaica",
    negocio: "GNOMON",
    ciudad: "Lalín",
    sector: "Instalación fotovoltaica",
    concepto:
      "«Sombra»: lo que decide una instalación no es el sol, es la sombra que le cae encima.",
    movimiento:
      "Un día entero pasando sobre el tejado: el scroll son las horas y las sombras de la chimenea y del castaño tapan módulos de verdad.",
    etiquetas: ["Simulación", "Scroll anclado", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-fotovoltaica-web/",
    destacada: true,
  },
  {
    slug: "queseria",
    negocio: "Queixería Bardanca",
    ciudad: "Palas de Rei",
    sector: "Quesería artesanal",
    concepto: "«Corteza»: la corteza es el diario del queso, ahí está escrito el tiempo.",
    movimiento:
      "Un selector de curación (20/90/180/400 días) que transforma la rueda dibujada entera: corteza, pasta, moho, ojos y cristales.",
    etiquetas: ["Configurador", "SVG propio", "Ficha de producto"],
    demo: "https://alvarotaiagu.github.io/plantilla-queseria-web/",
    destacada: true,
  },
  {
    slug: "coworking",
    negocio: "O FAIADO",
    ciudad: "A Coruña",
    sector: "Coworking",
    concepto: "«Ocupación»: el dato que nadie publica, a qué hora hay sitio libre.",
    movimiento:
      "El plano de la planta se maneja por hora y por día, lo mueve el visitante y no el scroll.",
    etiquetas: ["Plano interactivo", "Disponibilidad", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-coworking-web/",
    destacada: true,
  },
  {
    slug: "sastreria",
    negocio: "Sastrería Arume",
    ciudad: "Betanzos",
    sector: "Sastrería a medida",
    concepto:
      "«El revés»: lo que se ve de una chaqueta es la mitad, la otra mitad está por dentro.",
    movimiento:
      "La chaqueta se gira de verdad en 3D y enseña entretela, hombrera, sisa, bolsillo interior y ojal a mano.",
    etiquetas: ["3D en CSS", "Despiece", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-sastreria-web/",
    destacada: true,
  },
  {
    slug: "balneario",
    negocio: "As Caldeiras",
    ciudad: "Allariz",
    sector: "Balneario y casa de baños",
    concepto: "«Grados»: el circuito es una escalera de temperaturas y la página se templa contigo.",
    movimiento:
      "La estación que tienes en el centro tiñe la página entera —fondo, acento y barras— de los 12° gris verdoso a los 45° melocotón.",
    etiquetas: ["Tema que reacciona", "Circuito", "Reservas"],
    demo: "https://alvarotaiagu.github.io/plantilla-balneario-web/",
    destacada: true,
  },
  {
    slug: "libreria",
    negocio: "Librería Cuadratín",
    ciudad: "A Coruña",
    sector: "Librería",
    concepto: "«Lomos»: una librería es una pared de cantos y ahí está todo el catálogo.",
    movimiento:
      "La balda: 46 lomos que salen a saludar al pasar el dedo y arrastran a los vecinos, con los titulares subiendo desde detrás del canto.",
    etiquetas: ["Catálogo", "Interacción física", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-libreria-web/",
    destacada: true,
  },
  {
    slug: "taller",
    negocio: "RODADURA",
    ciudad: "Culleredo",
    sector: "Taller mecánico",
    concepto: "«Despiece»: el taller se explica separando las piezas de una rueda.",
    movimiento:
      "Despiece anclado de siete piezas SVG que se separan con el scroll, con la rueda del hero trazándose sola.",
    etiquetas: ["Despiece", "Presupuestos", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-taller-web/",
    destacada: true,
  },
  {
    slug: "floristeria",
    negocio: "Ramalleira",
    ciudad: "Betanzos",
    sector: "Floristería",
    concepto: "«Ramo»: el ramo se monta delante de ti, tallo a tallo.",
    movimiento:
      "Sección anclada en la que el ramo dibujado se completa grupo a grupo mientras pasan los cinco pasos, con contador de tallos.",
    etiquetas: ["Ilustración propia", "Pedidos", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-floristeria-web/",
    destacada: true,
  },
  {
    slug: "gimnasio",
    negocio: "VINTE QUILOS",
    ciudad: "A Coruña",
    sector: "Gimnasio y box de entrenamiento",
    concepto: "«Carga»: todo se mide en kilos y la página se carga de discos conforme bajas.",
    movimiento:
      "Cuadro semanal anclado con desplazamiento horizontal, sobre un hero de canvas con magnesio en suspensión y la barra flexionando.",
    etiquetas: ["Horarios", "Canvas", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-gimnasio-web/",
    destacada: true,
  },
  {
    slug: "abogados-portico",
    negocio: "Valladares Mendoza Abogados",
    ciudad: "Vigo",
    sector: "Abogacía mercantil",
    concepto: "«Pórtico»: el edificio institucional que hay que atravesar antes de llegar al asunto.",
    movimiento:
      "Columnata SVG con paralaje que avanza y se separa mientras el nombre se talla en el arquitrabe.",
    etiquetas: ["Paralaje", "Áreas de práctica", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-abogados-portico-web/",
  },
  {
    slug: "abogados-contraluz",
    negocio: "Ferradás Vilar · Defensa Penal",
    ciudad: "Santiago de Compostela",
    sector: "Abogacía penal",
    concepto:
      "«Contraluz»: en un procedimiento penal nadie ve el asunto entero, se ve lo que alguien decide iluminar.",
    movimiento:
      "Un foco de luz fijo que sigue al cursor y decide qué está iluminado y qué queda en penumbra.",
    etiquetas: ["Luz interactiva", "Confidencialidad", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-abogados-contraluz-web/",
  },
  {
    slug: "viajes",
    negocio: "Viajes Arroaz",
    ciudad: "Viveiro",
    sector: "Agencia de viajes",
    concepto: "«Sellos»: lo que queda de un viaje es el sello del pasaporte, y cada viaje es uno.",
    movimiento: "Seis sellos dibujados que se estampan con rebote al llegar a ellos.",
    etiquetas: ["Catálogo", "Ilustración propia", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-viajes-web/",
  },
  {
    slug: "apicultura",
    negocio: "Mel do Cordal",
    ciudad: "Mazaricos",
    sector: "Apicultura y mielería",
    concepto:
      "«Tres quilómetros»: una miel es el mapa de lo que florece en el radio en que trabaja la abeja.",
    movimiento:
      "Lámina comparativa de cuatro colmenares con sus mapas de radio trazándose, y cuatro tarros que se llenan con el color real de su miel.",
    etiquetas: ["Comparador", "Mapas SVG", "Venta directa"],
    demo: "https://alvarotaiagu.github.io/plantilla-apicultura-web/",
  },
  {
    slug: "arquitectura",
    negocio: "Perpiaño",
    ciudad: "Lugo",
    sector: "Arquitectura y reformas",
    concepto: "«Planta»: lo que hay y lo que va a haber, explicado en planta.",
    movimiento:
      "Comparador de plantas antes/después arrastrable, con los tabiques derribados en almagre y las cifras cambiando de lado.",
    etiquetas: ["Comparador", "Portfolio", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-arquitectura-web/",
  },
  {
    slug: "autoescuela",
    negocio: "CARRIL DEZ",
    ciudad: "Arteixo",
    sector: "Autoescuela",
    concepto: "«Carril»: la web es el camino hasta el carné, en seis tramos.",
    movimiento:
      "Un coche recorriendo el trazado SVG con el scroll y pintando el camino hecho, con test de muestra que corrige de verdad.",
    etiquetas: ["Test funcional", "Tarifas", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-autoescuela-web/",
  },
  {
    slug: "bicicletas",
    negocio: "Sete Curvas",
    ciudad: "A Coruña",
    sector: "Tienda y taller de bicicletas",
    concepto: "«Perfil de etapa»: la web se lee como una altimetría.",
    movimiento:
      "Perfil de altimetría fijo abajo que se pinta con el scroll, con ciclista que avanza y lectura en vivo de kilómetros, altitud y pendiente.",
    etiquetas: ["Indicador de avance", "Taller", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-bicicletas-web/",
  },
  {
    slug: "carpinteria",
    negocio: "Espiga",
    ciudad: "A Coruña",
    sector: "Carpintería a medida",
    concepto: "«Ensamble»: dos piezas que encajan sin un solo tornillo.",
    movimiento:
      "La espiga entrando en su mortaja: dos piezas SVG que llegan separadas, encajan solas y se pueden volver a separar.",
    etiquetas: ["Presupuestos", "Materiales", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-carpinteria-web/",
  },
  {
    slug: "ceramica",
    negocio: "Olería Rañal",
    ciudad: "Ponteceso",
    sector: "Taller de cerámica",
    concepto:
      "«Merma»: todo lo que sale del horno es más pequeño de lo que hiciste, y la plantilla lo mide.",
    movimiento:
      "Una regla graduada que no se mueve y, contra ella, la misma jarra dibujada a sus tres tamaños reales.",
    etiquetas: ["Cursos", "Ilustración propia", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-ceramica-web/",
  },
  {
    slug: "cerveceria",
    negocio: "TRASFEGA",
    ciudad: "Betanzos",
    sector: "Cervecería artesanal",
    concepto:
      "«Trasfega»: la cerveza cambia cinco veces de recipiente y la web hace lo mismo con el líquido.",
    movimiento:
      "Escena anclada del obrador en la que el líquido se llena y se vacía de recipiente en recipiente, con malta cayendo en el hero.",
    etiquetas: ["Canvas", "Proceso", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-cerveceria-web/",
  },
  {
    slug: "enoteca",
    negocio: "Trasfega Enoteca",
    ciudad: "A Coruña",
    sector: "Enoteca",
    concepto: "«Cata a ciegas»: primero el vino, después la etiqueta.",
    movimiento:
      "La funda que tapa la etiqueta y se levanta al pasar el dedo, al enfocar con el teclado o sola en el hero.",
    etiquetas: ["Catálogo", "Catas", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-enoteca-web/",
  },
  {
    slug: "escuela-musica",
    negocio: "Semitón",
    ciudad: "A Coruña",
    sector: "Escuela de música",
    concepto: "«Afinación»: todo en la página llega girado y se coloca en su sitio.",
    movimiento:
      "El afinador del hero: eliges cuerda, la aguja se va al desvío y vuelve al centro.",
    etiquetas: ["Herramienta útil", "Matrícula", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-escuela-musica-web/",
  },
  {
    slug: "fotografia",
    negocio: "CHINAGRAPH",
    ciudad: "Vigo",
    sector: "Estudio de fotografía",
    concepto: "«Hoja de contactos»: una web de fotógrafo sin ni una fotografía, a propósito.",
    movimiento: "La marca de lápiz rojo que elige la toma buena, trazada fotograma a fotograma.",
    etiquetas: ["Sin fotos", "Portfolio", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-fotografia-web/",
  },
  {
    slug: "hotel-rural",
    negocio: "Casa Bricaña",
    ciudad: "Boimorto",
    sector: "Hotel rural",
    concepto: "«Orballo»: el cristal empañado que hay que despejar para ver el valle.",
    movimiento:
      "Hero de canvas con vaho y gotas que resbalan, se limpia con el dedo y se despeja con el scroll.",
    etiquetas: ["Canvas", "Reservas", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-hotel-rural-web/",
  },
  {
    slug: "lavanderia",
    negocio: "Escuma",
    ciudad: "A Coruña",
    sector: "Lavandería",
    concepto: "«Etiqueta»: los símbolos de cuidado son a la vez el sistema visual y la herramienta.",
    movimiento: "El descifrador de etiquetas: doce símbolos dibujados que explican qué hacer con cada prenda.",
    etiquetas: ["Herramienta útil", "Tarifas", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-lavanderia-web/",
  },
  {
    slug: "mudanzas",
    negocio: "CARREXO",
    ciudad: "Ordes",
    sector: "Mudanzas y guardamuebles",
    concepto: "«Inventario»: en una mudanza todo lo que importa está numerado.",
    movimiento: "El camión anclado que se carga caja a caja con el scroll.",
    etiquetas: ["Presupuestos", "Scroll anclado", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-mudanzas-web/",
  },
  {
    slug: "optica",
    negocio: "Óptica Sextante",
    ciudad: "A Coruña",
    sector: "Óptica",
    concepto: "«Optotipo»: la carta del oculista como sistema de tipografía.",
    movimiento:
      "La carta de optotipos que se lee sola con la regleta saltando de fila, y el enfoque (de borroso a nítido) como transición de todo.",
    etiquetas: ["Cita previa", "Catálogo", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-optica-web/",
  },
  {
    slug: "panaderia",
    negocio: "Milmigas",
    ciudad: "A Coruña",
    sector: "Panadería y obrador",
    concepto: "«La miga»: el pan se juzga por dentro, no por la corteza.",
    movimiento:
      "Canvas de fermentación en el hero, con burbujas que nacen, crecen y suben, y galería anclada de seis cortes de pan.",
    etiquetas: ["Canvas", "Encargos", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-panaderia-web/",
  },
  {
    slug: "seguridad-alarmas",
    negocio: "ALDRABA Seguridad",
    ciudad: "Ferrol",
    sector: "Seguridad y alarmas",
    concepto:
      "«Secuencia»: lo que contratas no es una sirena, es lo que pasa en los dos minutos siguientes.",
    movimiento:
      "El reloj de un salto de alarma: el scroll son los segundos, de 00:00 a 02:00, con los ocho pasos desfilando en horizontal.",
    etiquetas: ["Procedimiento", "Scroll anclado", "Modo oscuro"],
    demo: "https://alvarotaiagu.github.io/plantilla-seguridad-alarmas-web/",
  },
  {
    slug: "tatuajes",
    negocio: "Papel Vegetal",
    ciudad: "A Coruña",
    sector: "Estudio de tatuajes",
    concepto: "«Calco»: del papel vegetal a la piel, el trazo es el mismo.",
    movimiento: "Trazado de línea SVG que se dibuja primero y se entinta después.",
    etiquetas: ["Portfolio", "Cita previa", "Modo claro"],
    demo: "https://alvarotaiagu.github.io/plantilla-tatuajes-web/",
  },
];

export const plantillasDestacadas = plantillas.filter((p) => p.destacada);

/** Sectores únicos, en el orden en que aparecen. Alimenta el filtro de /plantillas. */
export const sectoresPlantillas = Array.from(new Set(plantillas.map((p) => p.sector))).sort(
  (a, b) => a.localeCompare(b, "es")
);
