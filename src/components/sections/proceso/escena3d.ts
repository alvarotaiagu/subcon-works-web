/**
 * «El bloque» en Three.js (boceto A, D-037): un corte del terreno con los seis estratos
 * de la marca; bajo la superficie se abre un pozo y dentro se levanta, pieza a pieza, el
 * bloque gris del símbolo. Al final sale entero, se le posa la punta y queda el logotipo.
 *
 * Reglas (D-037, `feedback_threejs_rendimiento_color`):
 * - este módulo solo se carga con `import()`: `three` va en su chunk, nunca en el JS
 *   inicial (D-028). Imports con nombre: Turbopack ya recortaba `import * as THREE` (no
 *   lleva cargadores, animación ni audio) y el chunk se queda en ~576 KB (142 KB gz),
 *   casi todo el GLSL de `ShaderChunk` que el renderer necesita; importar módulo a módulo
 *   desde `three/src` pesa 2 KB más (la envoltura de cada módulo), así que no se usa;
 * - sin transmission, RectAreaLight ni bloom; colores en sRGB desde las variables CSS
 *   (`leerColores`), `new Color('#hex')`; sombra VSM que solo se recalcula al pintar;
 *   DPR tope 1,5 con bajada automática (ver `LENTO_MS`);
 * - se pinta solo cuando cambia el progreso (o el tamaño): ningún bucle.
 *
 * El montaje va en tareas cortas (D-031: ninguna tarea larga de más de 300 ms con CPU ×4):
 * entre una fase y la siguiente se cede el hilo (`ceder`). Fases: renderer y luces;
 * geometrías y materiales; compilar (un `compileAsync` por objeto, en paralelo en la GPU
 * con `KHR_parallel_shader_compile`); sombra (un fotograma escondido por material, para
 * compilar lo que `compileAsync` no ve: la profundidad de la sombra, el desenfoque VSM y
 * las variantes con plano de recorte, que `compile()` prepara sin el estado de recorte);
 * y el primer fotograma entero. El lienzo está con `visibility: hidden` hasta que el que
 * llama lo enseña.
 *
 * Sin React: recibe el lienzo y devuelve `pintar(estado)` y `destruir()`.
 */
// Antes que `three`: marca el momento en que empieza a evaluarse (ver `marca.ts`).
import { antesDeThree } from "./marca";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  InstancedBufferAttribute,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshStandardMaterial,
  NearestFilter,
  NoToneMapping,
  PerspectiveCamera,
  Plane,
  Quaternion,
  RGBADepthPacking,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector2,
  Vector3,
  VSMShadowMap,
  WebGLRenderer,
  type Material,
  type Object3D,
} from "three";
import { ALZA_Y, ALZA_Z, BX, BZ, CURSOS, GAP, H, piezas as PIEZAS, SONDAS, TOPE, Y0, ZC, type Colores, type Estado } from "./reloj";

/** Lo que ha costado evaluar `three` (ms), medido sin la API de tareas largas (`?fps`). */
export const evaluarThree = performance.now() - antesDeThree;

export interface Escena3D {
  /** Pinta el estado (en el siguiente fotograma; varias llamadas seguidas pintan una vez). */
  pintar(e: Estado): void;
  /** Suelta todo lo creado (el contexto se queda: el lienzo se reutiliza). */
  destruir(): void;
}

/** Las fases del montaje, para el desglose de `?fps`. */
export type FaseMontaje = "montar" | "compilar" | "sombra" | "fotograma";

export interface OpcionesEscena {
  lienzo: HTMLCanvasElement;
  colores: Colores;
  /** El estado de ahora (el del scroll): se pinta en el primer fotograma. */
  estado: () => Estado;
  /** Donde escribir «N fps · …» (`?fps`); `null` para no medir en pantalla. */
  fps?: HTMLElement | null;
  /** Lo que dura (ms) la tarea más larga de cada fase del montaje, según acaba cada una (`?fps`). */
  alMedir?: (fase: FaseMontaje, ms: number, extra?: string) => void;
  /** Se llama si el navegador pierde el contexto WebGL ya montada la escena: el que llama vuelve al plan B. */
  alPerder?: () => void;
  /** Corta el montaje a medias (la sección se desmonta): la promesa rechaza con `AbortError`. */
  senal?: AbortSignal;
}

/**
 * Bajada de calidad: si la mediana de 20 fotogramas seguidos pasa de esto, un peldaño.
 *
 * Se mide el intervalo entre fotogramas (y no lo que tarda `render()`) porque `render()`
 * solo cuenta la CPU: la GPU trabaja aparte y un móvil con poca GPU pintaría «rápido»
 * mientras los fotogramas llegan tarde. El tope está en 40 ms (25 fps) y no en 24: Chrome
 * con Ahorro de energía (o una pantalla a 30 Hz) entrega 33,3 ms clavados aunque la escena
 * sobre, y con 24 ms eso se tomaba por lentitud y bajaba a calidad 3 sin motivo. 30 fps
 * estables no son lentitud; por debajo de 25 sí hay que aligerar.
 */
const LENTO_MS = 40;
const DPR_TOPE = 1.5;

/** Las tres sondas: x y hasta dónde bajan. */
const SONDAS_X = [-0.5, 0, 0.5];

/** Cede el hilo entre fase y fase: `scheduler.yield()` si lo hay (sigue antes que otras tareas), si no `setTimeout(0)`. */
const ceder = (): Promise<void> => {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return typeof s?.yield === "function" ? s.yield() : new Promise((r) => setTimeout(r, 0));
};

type Dibujable = Mesh | Line;
const esDibujable = (o: Object3D): o is Dibujable => (o as Mesh).isMesh === true || (o as Line).isLine === true;

export async function montarEscena3D({ lienzo, colores, estado: estadoAhora, fps = null, alMedir, alPerder, senal }: OpcionesEscena): Promise<Escena3D> {
  // Lo que se va creando, para soltarlo si el montaje se corta a medias.
  const porSoltar: { dispose(): void }[] = [];
  const guardar = <T extends { dispose(): void }>(x: T) => {
    porSoltar.push(x);
    return x;
  };
  let montada = false;
  let vivo = true;
  let tamano: ResizeObserver | null = null;
  let soltarSombra = () => {};
  const soltar = () => {
    vivo = false;
    tamano?.disconnect();
    lienzo.removeEventListener("webglcontextlost", perdido);
    soltarSombra();
    for (const x of porSoltar) x.dispose();
    porSoltar.length = 0;
    // Sin `forceContextLoss()`: el lienzo es el mismo cuando la escena vuelve a montarse
    // (Sobria y vuelta, movimiento reducido y vuelta) y `getContext` le devolvería el
    // contexto ya perdido, es decir, un lienzo negro con el plan B escondido.
  };

  // Corte: la sección se desmonta o se pierde el contexto mientras se monta.
  let cortar: (e: Error) => void = () => {};
  let corteError: Error | null = null;
  const corte = new Promise<never>((_, rechazar) => {
    cortar = (e) => {
      corteError ??= e;
      rechazar(e);
    };
  });
  corte.catch(() => {}); // se lee con `Promise.race` y en `empezar`; sin aviso de promesa sin atender
  const alCortar = () => cortar(new DOMException("Proceso: montaje del 3D cortado", "AbortError"));
  if (senal?.aborted) alCortar();
  senal?.addEventListener("abort", alCortar, { once: true });
  // Contexto perdido: montada, vuelve el plan B; a medias, se corta el montaje.
  function perdido(ev: Event) {
    ev.preventDefault();
    if (montada) alPerder?.();
    else cortar(new Error("Proceso: contexto WebGL perdido durante el montaje"));
  }

  // Cada fase en su tarea: se cede, se mira si hay que cortar y se mide lo que dura.
  const largas: Partial<Record<FaseMontaje, number>> = {};
  let fase: FaseMontaje | null = null;
  let t0 = 0;
  const cerrar = (extra?: string) => {
    if (!fase) return;
    const ms = Math.max(largas[fase] ?? 0, performance.now() - t0);
    largas[fase] = ms;
    alMedir?.(fase, ms, extra);
    fase = null;
  };
  const empezar = async (f: FaseMontaje) => {
    cerrar();
    await ceder();
    if (corteError) throw corteError;
    fase = f;
    t0 = performance.now();
  };

  try {
    // ── 1. Renderer y luces ─────────────────────────────────────────────────────
    await empezar("montar");
    const color = (hex: string) => new Color(hex);
    const renderer = guardar(new WebGLRenderer({ canvas: lienzo, antialias: true, powerPreference: "high-performance" }));
    lienzo.addEventListener("webglcontextlost", perdido);
    renderer.setClearColor(color(colores.hondo));
    renderer.toneMapping = NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = VSMShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.localClippingEnabled = true;
    let nitidez = Math.min(window.devicePixelRatio || 1, DPR_TOPE);
    renderer.setPixelRatio(nitidez);

    const scene = new Scene();
    scene.fog = new Fog(color(colores.hondo), 7, 15);
    const cam = new PerspectiveCamera(30, 1, 0.1, 40);

    // Luz: una direccional con sombra (solo se recalcula al pintar) y un rebote de cielo.
    const sol = new DirectionalLight(color(colores.hueso), 2.0);
    sol.position.set(3, 4.5, 3.5);
    sol.target.position.set(0, -0.8, -0.5);
    sol.castShadow = true;
    const movil = window.innerWidth < 700;
    let ladoSombra = movil ? 512 : 1024;
    sol.shadow.mapSize.set(ladoSombra, ladoSombra);
    sol.shadow.radius = 5;
    sol.shadow.blurSamples = 8;
    sol.shadow.bias = -0.0004;
    Object.assign(sol.shadow.camera, { left: -3.2, right: 3.2, top: 3.2, bottom: -3.2, near: 0.5, far: 14 });
    soltarSombra = () => sol.shadow.dispose();
    const cielo = new HemisphereLight(color(colores.apagado), color(colores.roca), 0.7);
    scene.add(sol, sol.target, cielo);

    // ── 2. Geometrías y materiales ──────────────────────────────────────────────
    await empezar("montar");
    // Los estratos: una textura de seis bandas en las caras verticales del terreno.
    const cv = document.createElement("canvas");
    cv.width = 4;
    cv.height = 192;
    const g = cv.getContext("2d");
    if (!g) throw new Error("Proceso: sin contexto 2d para los estratos");
    colores.estratos.forEach((c, k) => {
      g.fillStyle = c;
      g.fillRect(0, k * 32, 4, 32);
    });
    const tex = guardar(new CanvasTexture(cv));
    tex.colorSpace = SRGBColorSpace;
    tex.magFilter = tex.minFilter = NearestFilter;
    tex.generateMipmaps = false;
    const lado = guardar(new MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 }));
    const tapa = guardar(new MeshStandardMaterial({ color: color(colores.estratos[0]), roughness: 0.95 }));
    const fondo = guardar(new MeshStandardMaterial({ color: color(colores.estratos[5]), roughness: 1 }));
    const terreno = [lado, lado, tapa, fondo, lado, lado];
    const caja = (w: number, h: number, d: number, x: number, y: number, z: number, mats: Material | Material[]) => {
      const m = new Mesh(guardar(new BoxGeometry(w, h, d)), mats);
      m.position.set(x, y, z);
      m.castShadow = m.receiveShadow = true;
      scene.add(m);
      return m;
    };
    caja(6.05, 1.6, 4, -3.975, -0.8, -2, terreno);
    caja(6.05, 1.6, 4, 3.975, -0.8, -2, terreno);
    caja(1.9, 1.6, 3.25, 0, -0.8, -2.375, terreno);
    caja(1.9, 0.04, 0.75, 0, -1.58, -0.375, fondo);
    // El tapón del pozo: el mismo terreno, recortado por un plano que baja (excavación).
    const planoExc = new Plane(new Vector3(0, -1, 0), 0);
    const ladoT = guardar(lado.clone());
    const tapaT = guardar(tapa.clone());
    for (const m of [ladoT, tapaT]) {
      m.clippingPlanes = [planoExc];
      m.clipShadows = true;
    }
    caja(1.9, 1.6, 0.75, 0, -0.8, -0.375, [ladoT, ladoT, tapaT, fondo, ladoT, ladoT]);

    // La superficie: la línea lima del símbolo, que sigue el perfil del corte (y baja con el pozo).
    const lima = guardar(new LineBasicMaterial({ color: color(colores.superficie) }));
    const perfilGeo = guardar(new BufferGeometry());
    const perfilPos = new Float32Array(6 * 3);
    perfilGeo.setAttribute("position", new BufferAttribute(perfilPos, 3));
    const perfilLinea = new Line(perfilGeo, lima);
    // La geometría cambia en cada fotograma y three calcula su esfera una sola vez: sin esto
    // se recortaría con la esfera del primer estado.
    perfilLinea.frustumCulled = false;
    scene.add(perfilLinea);
    const ponerPerfil = (c: number) => {
      const pts = [
        [-7, 0],
        [-0.95, 0],
        [-0.95, c],
        [0.95, c],
        [0.95, 0],
        [7, 0],
      ];
      pts.forEach(([x, y], k) => perfilPos.set([x, y + 0.003, 0.004], k * 3));
      perfilGeo.attributes.position.needsUpdate = true;
    };

    // Las sondas: tres líneas que bajan a distinta profundidad, con su tick.
    const limaSonda = guardar(new LineBasicMaterial({ color: color(colores.superficie), transparent: true, opacity: 1 }));
    const sondas = SONDAS_X.map((x, j) => {
      const geo = guardar(new BufferGeometry());
      const pos = new Float32Array(4 * 3);
      geo.setAttribute("position", new BufferAttribute(pos, 3));
      const l = new LineSegments(geo, limaSonda);
      l.frustumCulled = false; // baja con el scroll: su esfera del primer fotograma se queda corta
      scene.add(l);
      return { x, fondoY: -SONDAS[j], pos, geo, l };
    });

    // La obra: alambre (dos copias: tenue y viva), piezas instanciadas y el plano de luz.
    const obra = new Group();
    scene.add(obra);
    const aristas: number[] = [];
    CURSOS.forEach((n, c) => {
      const y = Y0 + H / 2 + c * (H + GAP);
      const cajaCurso = new BoxGeometry(BX, H, BZ);
      const e = new EdgesGeometry(cajaCurso);
      const a = e.attributes.position.array;
      for (let k = 0; k < a.length; k += 3) aristas.push(a[k], a[k + 1] + y, a[k + 2] + ZC);
      e.dispose();
      cajaCurso.dispose();
    });
    const alambreGeo = guardar(new BufferGeometry());
    alambreGeo.setAttribute("position", new BufferAttribute(new Float32Array(aristas), 3));
    const planoAlambre = new Plane(new Vector3(0, -1, 0), -1.6);
    const planoScan = new Plane(new Vector3(0, -1, 0), -1.6);
    const alambreTenue = new LineSegments(
      alambreGeo,
      guardar(new LineBasicMaterial({ color: color(colores.superficie), transparent: true, opacity: 0.4, clippingPlanes: [planoAlambre] })),
    );
    const alambreVivo = new LineSegments(alambreGeo, guardar(new LineBasicMaterial({ color: color(colores.superficie), clippingPlanes: [planoScan] })));
    obra.add(alambreTenue, alambreVivo);

    // Las piezas entran desde fuera: el desplazamiento se hace en el vértice (uniforme uObra
    // y atributos por instancia), también en el material de profundidad de la sombra.
    const uObra = { value: 0 };
    const conObra = <M extends Material>(mat: M): M => {
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uObra = uObra;
        sh.vertexShader =
          "attribute float aT;\nattribute vec3 aDesde;\nuniform float uObra;\n" +
          sh.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
  float kO = clamp((uObra - aT) / 0.12, 0.0, 1.0);
  kO = 1.0 - pow(1.0 - kO, 3.0);
  transformed += aDesde * (1.0 - kO);`,
          );
      };
      mat.customProgramCacheKey = () => "obra-" + mat.type;
      return mat;
    };
    const geoPieza = guardar(new BoxGeometry(1, 1, 1));
    const aT = new Float32Array(PIEZAS.length);
    const aDesde = new Float32Array(PIEZAS.length * 3);
    PIEZAS.forEach((p, k) => {
      aT[k] = p.t;
      // El desplazamiento se aplica antes de la matriz de instancia (que escala): se compensa.
      aDesde.set([p.desde[0] / p.w, p.desde[1] / H, p.desde[2] / BZ], k * 3);
    });
    geoPieza.setAttribute("aT", new InstancedBufferAttribute(aT, 1));
    geoPieza.setAttribute("aDesde", new InstancedBufferAttribute(aDesde, 3));
    const piezas = new InstancedMesh(
      geoPieza,
      conObra(guardar(new MeshStandardMaterial({ color: color(colores.bloque), roughness: 0.7, metalness: 0.05 }))),
      PIEZAS.length,
    );
    piezas.customDepthMaterial = conObra(guardar(new MeshDepthMaterial({ depthPacking: RGBADepthPacking })));
    piezas.castShadow = piezas.receiveShadow = true;
    const m4 = new Matrix4();
    const pos = new Vector3();
    const giro = new Quaternion();
    const tam = new Vector3();
    PIEZAS.forEach((p, k) => {
      m4.compose(pos.set(p.x, p.y, p.z), giro, tam.set(p.w, H, BZ));
      piezas.setMatrixAt(k, m4);
    });
    piezas.instanceMatrix.needsUpdate = true;
    obra.add(piezas);
    guardar(piezas);

    const scan = new Mesh(
      guardar(new BoxGeometry(BX + 0.12, 0.006, BZ + 0.12)),
      guardar(new MeshBasicMaterial({ color: color(colores.superficie), toneMapped: false })),
    );
    scan.position.set(0, Y0, ZC);
    scan.visible = false;
    obra.add(scan);

    // La punta blanca del símbolo: un prisma que se posa sobre el bloque al final.
    const forma = new Shape([new Vector2(-0.8, 0), new Vector2(0.8, 0), new Vector2(0.22, 0.5)]);
    const punta = new Mesh(
      guardar(new ExtrudeGeometry(forma, { depth: BZ, bevelEnabled: false })),
      guardar(new MeshStandardMaterial({ color: color(colores.hueso), roughness: 0.6 })),
    );
    punta.castShadow = punta.receiveShadow = true;
    punta.visible = false;
    scene.add(punta);

    // Poner la escena en un estado (sin pintar).
    const objetivo = new Vector3();
    const aplicar = (e: Estado) => {
      const c = -1.6 * e.excavado;
      planoExc.constant = c;
      ponerPerfil(c);
      sondas.forEach((s, j) => {
        const y = s.fondoY * e.sondas[j];
        s.pos.set([s.x, 0, -0.3, s.x, y, -0.3, s.x - 0.06, y, -0.3, s.x + 0.06, y, -0.3]);
        s.geo.attributes.position.needsUpdate = true;
        s.l.visible = e.sondas[j] > 0 && e.sondasOp > 0.01;
      });
      limaSonda.opacity = e.sondasOp;
      planoAlambre.constant = e.alambre >= 1 ? 10 : Y0 - 0.05 + (TOPE - Y0 + 0.1) * e.alambre;
      uObra.value = e.obra;
      scan.visible = e.scanVisible;
      scan.position.y = Y0 - 0.02 + (TOPE - Y0 + 0.04) * e.scan;
      planoScan.constant = e.scan >= 1 ? 10 : e.scan > 0 ? scan.position.y : -1.7;
      obra.position.set(0, ALZA_Y * e.alza, ALZA_Z * e.alza);
      punta.visible = e.punta > 0;
      punta.position.set(0, TOPE + ALZA_Y + 2.2 * (1 - e.punta), ZC + ALZA_Z - BZ / 2);
      // Cámara: rodea despacio, y al final se aleja y sigue al bloque.
      const p = e.camara;
      const az = -0.5 + 0.85 * p;
      const el = 0.24 + 0.08 * e.alza;
      const r = (5.4 + 1.0 * e.alza) * (cam.aspect < 1 ? 1.55 : 1);
      objetivo.set(0, -0.75 + 1.3 * e.alza, -0.3 + 0.9 * e.alza);
      cam.position.set(objetivo.x + r * Math.sin(az) * Math.cos(el), objetivo.y + r * Math.sin(el), objetivo.z + r * Math.cos(az) * Math.cos(el));
      cam.lookAt(objetivo);
    };

    // Pintar solo cuando algo cambia, y medir los fotogramas seguidos para bajar calidad.
    let pendiente = 0;
    let ultimoPaint = 0;
    let calidad = 0;
    const tiempos: number[] = [];
    const medirFotograma = (ahora: number) => {
      if (ultimoPaint && ahora - ultimoPaint < 100) tiempos.push(ahora - ultimoPaint);
      ultimoPaint = ahora;
      if (tiempos.length < 20) return;
      const orden = [...tiempos].sort((a, b) => a - b);
      const mediana = orden[orden.length >> 1];
      tiempos.length = 0;
      if (mediana > LENTO_MS && calidad < 3) {
        calidad++;
        if (calidad === 1) nitidez = Math.min(1, nitidez);
        if (calidad === 2) nitidez = 0.8;
        renderer.setPixelRatio(nitidez);
        if (calidad === 3) {
          // Sombra a media resolución, no apagada: apagarla cambia la clave de todos los
          // programas y los recompila de golpe (una tarea larga en mitad del scroll). El
          // tamaño del mapa es un uniforme: basta con soltarlo y three lo rehace al pintar.
          ladoSombra >>= 1;
          sol.shadow.mapSize.set(ladoSombra, ladoSombra);
          sol.shadow.dispose();
          sol.shadow.map = null;
          sol.shadow.mapPass = null;
        }
        ajustar();
      }
      if (fps) fps.textContent = `${Math.round(1000 / mediana)} fps · ${mediana.toFixed(1)} ms · nitidez ${nitidez} · calidad ${calidad}`;
    };
    const pintar = () => {
      if (pendiente || !vivo || !montada) return;
      pendiente = requestAnimationFrame((ahora) => {
        pendiente = 0;
        if (!vivo) return;
        renderer.shadowMap.needsUpdate = true;
        renderer.render(scene, cam);
        medirFotograma(ahora);
      });
    };
    const ajustar = () => {
      const w = lienzo.clientWidth;
      const h = lienzo.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      pintar();
    };
    tamano = new ResizeObserver(ajustar);
    tamano.observe(lienzo);
    ajustar();
    aplicar(estadoAhora());

    // Lo que se pinta, de uno en uno.
    const dibujables: Dibujable[] = [];
    scene.traverse((o) => {
      if (esDibujable(o)) dibujables.push(o);
    });

    // ── 3. Compilar: un `compileAsync` por objeto, cada uno en su tarea ─────────────
    // Montar el texto de un shader estándar ya pesa con CPU ×4; todos a la vez pasaban de
    // 100 ms. La compilación en la GPU va en paralelo y se espera al final.
    const compilando: Promise<unknown>[] = [];
    for (const o of dibujables) {
      await empezar("compilar");
      compilando.push(renderer.compileAsync(o, cam, scene));
    }
    cerrar();
    await Promise.race([Promise.all(compilando), corte]);

    // ── 4. Sombra: un fotograma escondido por material, cada uno en su tarea ─────────
    // Lo que compila aquí lo hace de forma síncrona (three no deja pedirlo aparte), así que
    // se reparte: cada fotograma enseña un solo objeto con un solo material, sin recorte
    // por el encuadre, y compila como mucho su profundidad, su variante con recorte y, la
    // primera vez, el desenfoque VSM. Los materiales ya vistos (mismo material, misma clase
    // de objeto) se saltan.
    const vistos = new Set<string>();
    const guardado = dibujables.map((o) => ({ o, visible: o.visible, encuadre: o.frustumCulled, material: o.material }));
    for (const { o, material, encuadre } of guardado) {
      const mats = Array.isArray(material) ? [...new Set(material)] : [material];
      for (const m of mats) {
        const clave = `${m.uuid}|${(o as InstancedMesh).isInstancedMesh === true}|${o.castShadow}`;
        if (vistos.has(clave)) continue;
        vistos.add(clave);
        await empezar("sombra");
        for (const d of guardado) d.o.visible = d.o === o;
        o.frustumCulled = false;
        if (Array.isArray(material)) (o as Mesh).material = material.map(() => m);
        // Lo que no proyecta sombra (las líneas, el plano de luz) solo necesita su pasada.
        renderer.shadowMap.needsUpdate = o.castShadow;
        renderer.render(scene, cam);
        (o as Mesh).material = material;
        o.frustumCulled = encuadre;
      }
    }
    for (const d of guardado) d.o.visible = d.visible;

    // ── 5. El primer fotograma entero, en el estado de ahora ────────────────────────
    await empezar("fotograma");
    aplicar(estadoAhora());
    const programas = renderer.info.programs?.length ?? 0;
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, cam);
    const nuevos = (renderer.info.programs?.length ?? 0) - programas;
    // Si el primer fotograma aún compila algo, el calentamiento se ha dejado un material.
    cerrar(nuevos > 0 ? `compila ${nuevos}` : undefined);
    if (corteError) throw corteError;

    montada = true;
    senal?.removeEventListener("abort", alCortar);
    return {
      pintar(e) {
        aplicar(e);
        pintar();
      },
      destruir() {
        cancelAnimationFrame(pendiente);
        soltar();
      },
    };
  } catch (e) {
    fase = null;
    senal?.removeEventListener("abort", alCortar);
    soltar();
    throw e;
  }
}
