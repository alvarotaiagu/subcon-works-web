/**
 * «El bloque» en Three.js (boceto A, D-037): un corte del terreno con los seis estratos
 * de la marca; bajo la superficie se abre un pozo y dentro se levanta, pieza a pieza, el
 * bloque gris del símbolo. Al final sale entero, se le posa la punta y queda el logotipo.
 *
 * Reglas (D-037, `feedback_threejs_rendimiento_color`):
 * - este módulo solo se carga con `import()` al acercarse la sección: `three` va en su
 *   chunk, nunca en el JS inicial (D-028);
 * - sin transmission, RectAreaLight ni bloom; colores en sRGB desde las variables CSS
 *   (`leerColores`), `new Color('#hex')`; sombra VSM que solo se recalcula al pintar;
 *   DPR tope 1,5 con bajada automática (nitidez 1 → 0,8 → sin sombra) si los fotogramas
 *   seguidos pasan de 24 ms;
 * - se pinta solo cuando cambia el progreso (o el tamaño): ningún bucle.
 *
 * Sin React: recibe el lienzo y devuelve `pintar(estado)` y `destruir()`.
 */
import * as THREE from "three";
import { ALZA_Y, ALZA_Z, BX, BZ, CURSOS, GAP, H, piezas as PIEZAS, SONDAS, TOPE, Y0, ZC, type Colores, type Estado } from "./reloj";

export interface Escena3D {
  /** Pinta el estado (en el siguiente fotograma; varias llamadas seguidas pintan una vez). */
  pintar(e: Estado): void;
  /** Suelta todo lo creado (el contexto se queda: el lienzo se reutiliza). */
  destruir(): void;
  /**
   * Se resuelve cuando los shaders están compilados (`compileAsync`, con
   * `KHR_parallel_shader_compile` si lo hay). Hasta entonces no se pinta nada: así la
   * compilación no cae en una tarea larga en mitad del scroll (D-031). Rechaza si falla.
   */
  listo: Promise<void>;
}

export interface OpcionesEscena {
  lienzo: HTMLCanvasElement;
  colores: Colores;
  /** Donde escribir «N fps · …» (`?fps`); `null` para no medir en pantalla. */
  fps?: HTMLElement | null;
  /** Se llama si el navegador pierde el contexto WebGL (GPU reiniciada, poca memoria): el que llama vuelve al plan B. */
  alPerder?: () => void;
}

/** Fotogramas seguidos por encima de esto (mediana de 20) bajan la calidad un peldaño. */
const LENTO_MS = 24;
const DPR_TOPE = 1.5;

/** Las tres sondas: x y hasta dónde bajan. */
const SONDAS_X = [-0.5, 0, 0.5];

export function montarEscena3D({ lienzo, colores, fps = null, alPerder }: OpcionesEscena): Escena3D {
  const color = (hex: string) => new THREE.Color(hex);

  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(color(colores.hondo));
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.localClippingEnabled = true;
  let nitidez = Math.min(window.devicePixelRatio || 1, DPR_TOPE);
  renderer.setPixelRatio(nitidez);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(color(colores.hondo), 7, 15);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 40);

  // Luz: una direccional con sombra (solo se recalcula al pintar) y un rebote de cielo.
  const sol = new THREE.DirectionalLight(color(colores.hueso), 2.0);
  sol.position.set(3, 4.5, 3.5);
  sol.target.position.set(0, -0.8, -0.5);
  sol.castShadow = true;
  const movil = window.innerWidth < 700;
  sol.shadow.mapSize.set(movil ? 512 : 1024, movil ? 512 : 1024);
  sol.shadow.radius = 5;
  sol.shadow.blurSamples = 8;
  sol.shadow.bias = -0.0004;
  Object.assign(sol.shadow.camera, { left: -3.2, right: 3.2, top: 3.2, bottom: -3.2, near: 0.5, far: 14 });
  const cielo = new THREE.HemisphereLight(color(colores.apagado), color(colores.roca), 0.7);
  scene.add(sol, sol.target, cielo);

  const porSoltar: { dispose(): void }[] = [renderer];
  const guardar = <T extends { dispose(): void }>(x: T) => {
    porSoltar.push(x);
    return x;
  };

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
  const tex = guardar(new THREE.CanvasTexture(cv));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  const lado = guardar(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 }));
  const tapa = guardar(new THREE.MeshStandardMaterial({ color: color(colores.estratos[0]), roughness: 0.95 }));
  const fondo = guardar(new THREE.MeshStandardMaterial({ color: color(colores.estratos[5]), roughness: 1 }));
  const terreno = [lado, lado, tapa, fondo, lado, lado];
  const caja = (w: number, h: number, d: number, x: number, y: number, z: number, mats: THREE.Material | THREE.Material[]) => {
    const m = new THREE.Mesh(guardar(new THREE.BoxGeometry(w, h, d)), mats);
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
  const planoExc = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const ladoT = guardar(lado.clone());
  const tapaT = guardar(tapa.clone());
  for (const m of [ladoT, tapaT]) {
    m.clippingPlanes = [planoExc];
    m.clipShadows = true;
  }
  caja(1.9, 1.6, 0.75, 0, -0.8, -0.375, [ladoT, ladoT, tapaT, fondo, ladoT, ladoT]);

  // La superficie: la línea lima del símbolo, que sigue el perfil del corte (y baja con el pozo).
  const lima = guardar(new THREE.LineBasicMaterial({ color: color(colores.superficie) }));
  const perfilGeo = guardar(new THREE.BufferGeometry());
  const perfilPos = new Float32Array(6 * 3);
  perfilGeo.setAttribute("position", new THREE.BufferAttribute(perfilPos, 3));
  const perfilLinea = new THREE.Line(perfilGeo, lima);
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
  const limaSonda = guardar(new THREE.LineBasicMaterial({ color: color(colores.superficie), transparent: true, opacity: 1 }));
  const sondas = SONDAS_X.map((x, j) => {
    const geo = guardar(new THREE.BufferGeometry());
    const pos = new Float32Array(4 * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const l = new THREE.LineSegments(geo, limaSonda);
    l.frustumCulled = false; // baja con el scroll: su esfera del primer fotograma se queda corta
    scene.add(l);
    return { x, fondoY: -SONDAS[j], pos, geo, l };
  });

  // La obra: alambre (dos copias: tenue y viva), piezas instanciadas y el plano de luz.
  const obra = new THREE.Group();
  scene.add(obra);
  const aristas: number[] = [];
  CURSOS.forEach((n, c) => {
    const y = Y0 + H / 2 + c * (H + GAP);
    const cajaCurso = new THREE.BoxGeometry(BX, H, BZ);
    const e = new THREE.EdgesGeometry(cajaCurso);
    const a = e.attributes.position.array;
    for (let k = 0; k < a.length; k += 3) aristas.push(a[k], a[k + 1] + y, a[k + 2] + ZC);
    e.dispose();
    cajaCurso.dispose();
  });
  const alambreGeo = guardar(new THREE.BufferGeometry());
  alambreGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(aristas), 3));
  const planoAlambre = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1.6);
  const planoScan = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1.6);
  const alambreTenue = new THREE.LineSegments(
    alambreGeo,
    guardar(new THREE.LineBasicMaterial({ color: color(colores.superficie), transparent: true, opacity: 0.4, clippingPlanes: [planoAlambre] })),
  );
  const alambreVivo = new THREE.LineSegments(alambreGeo, guardar(new THREE.LineBasicMaterial({ color: color(colores.superficie), clippingPlanes: [planoScan] })));
  obra.add(alambreTenue, alambreVivo);

  // Las piezas entran desde fuera: el desplazamiento se hace en el vértice (uniforme uObra
  // y atributos por instancia), también en el material de profundidad de la sombra.
  const uObra = { value: 0 };
  const conObra = <M extends THREE.Material>(mat: M): M => {
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
  const geoPieza = guardar(new THREE.BoxGeometry(1, 1, 1));
  const aT = new Float32Array(PIEZAS.length);
  const aDesde = new Float32Array(PIEZAS.length * 3);
  PIEZAS.forEach((p, k) => {
    aT[k] = p.t;
    // El desplazamiento se aplica antes de la matriz de instancia (que escala): se compensa.
    aDesde.set([p.desde[0] / p.w, p.desde[1] / H, p.desde[2] / BZ], k * 3);
  });
  geoPieza.setAttribute("aT", new THREE.InstancedBufferAttribute(aT, 1));
  geoPieza.setAttribute("aDesde", new THREE.InstancedBufferAttribute(aDesde, 3));
  const piezas = new THREE.InstancedMesh(
    geoPieza,
    conObra(guardar(new THREE.MeshStandardMaterial({ color: color(colores.bloque), roughness: 0.7, metalness: 0.05 }))),
    PIEZAS.length,
  );
  piezas.customDepthMaterial = conObra(guardar(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })));
  piezas.castShadow = piezas.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const giro = new THREE.Quaternion();
  const tam = new THREE.Vector3();
  PIEZAS.forEach((p, k) => {
    m4.compose(pos.set(p.x, p.y, p.z), giro, tam.set(p.w, H, BZ));
    piezas.setMatrixAt(k, m4);
  });
  piezas.instanceMatrix.needsUpdate = true;
  obra.add(piezas);
  guardar(piezas);

  const scan = new THREE.Mesh(
    guardar(new THREE.BoxGeometry(BX + 0.12, 0.006, BZ + 0.12)),
    guardar(new THREE.MeshBasicMaterial({ color: color(colores.superficie), toneMapped: false })),
  );
  scan.position.set(0, Y0, ZC);
  scan.visible = false;
  obra.add(scan);

  // La punta blanca del símbolo: un prisma que se posa sobre el bloque al final.
  const forma = new THREE.Shape([new THREE.Vector2(-0.8, 0), new THREE.Vector2(0.8, 0), new THREE.Vector2(0.22, 0.5)]);
  const punta = new THREE.Mesh(
    guardar(new THREE.ExtrudeGeometry(forma, { depth: BZ, bevelEnabled: false })),
    guardar(new THREE.MeshStandardMaterial({ color: color(colores.hueso), roughness: 0.6 })),
  );
  punta.castShadow = punta.receiveShadow = true;
  punta.visible = false;
  scene.add(punta);

  // Pintar solo cuando algo cambia, y medir los fotogramas seguidos para bajar calidad.
  let pendiente = 0;
  let ultimoPaint = 0;
  let calidad = 0;
  let vivo = true;
  const tiempos: number[] = [];
  const medir = (ahora: number) => {
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
        renderer.shadowMap.enabled = false;
        scene.traverse((o) => {
          const mat = (o as THREE.Mesh).material;
          if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => (m.needsUpdate = true));
        });
      }
      ajustar();
    }
    if (fps) fps.textContent = `${Math.round(1000 / mediana)} fps · ${mediana.toFixed(1)} ms · nitidez ${nitidez} · calidad ${calidad}`;
  };
  let compilado = false;
  const pintar = () => {
    if (pendiente || !vivo || !compilado) return;
    pendiente = requestAnimationFrame((ahora) => {
      pendiente = 0;
      if (!vivo) return;
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, cam);
      medir(ahora);
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
  const tamano = new ResizeObserver(ajustar);
  tamano.observe(lienzo);
  // Contexto perdido: sin esto el lienzo se queda en blanco con el plan B ya escondido.
  const perdido = (ev: Event) => {
    ev.preventDefault();
    alPerder?.();
  };
  lienzo.addEventListener("webglcontextlost", perdido);
  ajustar();

  // Los shaders, antes del primer fotograma. Lo que empieza escondido (el plano de luz y la
  // punta) se enseña mientras compila para que no compile tarde, al llegar a su paso. Las
  // sombras (el material de profundidad de las piezas) compilan en el primer fotograma.
  scan.visible = punta.visible = true;
  const listo = renderer.compileAsync(scene, cam).then(() => {
    scan.visible = punta.visible = false;
    compilado = true;
  });

  const objetivo = new THREE.Vector3();
  return {
    listo,
    pintar(e) {
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
      pintar();
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(pendiente);
      tamano.disconnect();
      lienzo.removeEventListener("webglcontextlost", perdido);
      sol.shadow.dispose();
      for (const x of porSoltar) x.dispose();
      // Sin `forceContextLoss()`: el lienzo es el mismo cuando la escena vuelve a montarse
      // (Sobria y vuelta, movimiento reducido y vuelta) y `getContext` le devolvería el
      // contexto ya perdido, es decir, un lienzo negro con el plan B escondido.
    },
  };
}
