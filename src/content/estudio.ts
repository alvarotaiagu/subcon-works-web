import { TOTAL_PREGUNTAS } from "@/content/auditoria";
import { plantillas } from "@/content/plantillas";
import { proceso } from "@/content/proceso";

export interface Persona {
  nombre: string;
  rol: string;
  texto: string;
  /**
   * Retrato vertical 4:5 en public/estudio/. Va a `null` mientras no exista el
   * archivo: la tarjeta pinta un hueco con la inicial en vez de pedir una
   * imagen que da 404.
   */
  foto: string | null;
}

export interface Punto {
  titulo: string;
  texto: string;
}

/**
 * Quién hay detrás del estudio. Solo nombres de pila, y nada que no sea
 * verdad hoy: no hay clientes, así que no hay casos, testimonios ni cifras
 * de terceros.
 */
export const personas: Persona[] = [
  {
    nombre: "Álvaro",
    rol: "Web, código y automatización",
    texto:
      "Diseña y programa las webs, las tiendas y las herramientas del estudio, y monta las automatizaciones con IA. Si algo del código no te encaja, se lo dices a él y se cambia.",
    foto: null,
  },
  {
    nombre: "Yanin",
    rol: "Foto, vídeo y redes",
    texto:
      "Produce y edita las fotos y los vídeos para redes, que es lo que mejor se le da y lo que más le gusta. También trabaja con IA en el día a día del estudio.",
    foto: null,
  },
];

export const entradaEstudio =
  "Subcon Works somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien diseña tu web, escribe el código o monta tu vídeo.";

/**
 * Lo que el cliente controla, escrito como capacidad (lo que puede hacer) y no
 * como condición de presupuesto: nada de «sin permanencia» ni «sin letra
 * pequeña» en lo destacado.
 */
export const compromisos: Punto[] = [
  {
    titulo: "Abres el código cuando quieras.",
    texto:
      "Vive en un repositorio a tu nombre desde el primer día. Lo puedes leer, copiar o enseñárselo a otro programador.",
  },
  {
    titulo: "Entras en todo con tus claves.",
    texto:
      "El dominio, el alojamiento, el correo y las cuentas de Google y de pagos están a tu nombre. Nosotros entramos con el acceso que nos des.",
  },
  {
    titulo: "Te lo llevas entero.",
    texto:
      "Le pasas el repositorio y las claves a quien elijas, y esa persona sigue desde donde lo dejamos, sin rehacer nada.",
  },
];

/**
 * Las tiendas van sobre la plataforma compartida (cobra comisión por venta):
 * su código no es del cliente, así que la banda lo aclara debajo.
 */
export const notaCompromisos =
  "La tienda online va sobre nuestra plataforma, que es compartida: ahí el dominio es tuyo, el código de la plataforma no.";

/** Sale de lo que la web ya promete en Proceso, Auditoría y Plantillas. */
export const comoTrabajamos: Punto[] = [
  {
    titulo: "Primero miramos, luego hablamos de precio.",
    texto:
      `La auditoría gratuita son ${TOTAL_PREGUNTAS} preguntas y te deja un informe que es tuyo, sigas con nosotros o no.`,
  },
  {
    titulo: "Partimos de una base propia.",
    texto:
      `${plantillas.length} plantillas y las herramientas que hemos escrito nosotros. Se adapta a lo tuyo, no se empieza de cero, y por eso son semanas y no meses.`,
  },
  {
    titulo: "Lo ves funcionando antes de pagar.",
    // El mismo texto que el paso 05 de Proceso, para que no se separen.
    texto: proceso[4].descripcion,
  },
  {
    titulo: "Una conversación, no un ticket.",
    texto: "Escribes a quien lo hace y te contesta esa misma persona.",
  },
];
