# 003 · Plan · Posicionamiento y textos

Spec: [spec.md](spec.md) (aprobada, D-032) · Tareas: [tasks.md](tasks.md)
Estado del plan: **aprobado (D-034, 2026-11-01)**, con PD-1 a PD-9.

## 1. Punto de partida (leído en el código, 2026-11-01)

- **Ramas.**
  - `exp/consultora` (carpeta `subcon-works-web-consultora`) está en
    `2e13eb1`, con la portada de la consultora (`9b37511`) y la spec 003
    aprobada. **No existe en GitHub**: sigue a `origin/main` y va 2 por
    delante y 2 por detrás. Lo que le falta de `main` es la PR #51 (solo
    `specs/002-rediseno-por-debajo/comprobacion.md`).
  - `main` (carpeta `subcon-works-web`) publica en GitHub Pages. Lleva el
    rediseño de la 002 (PR #41) y los 7 servicios (PR #50). La 002 sigue
    «aprobada», no «hecha»: su T21 repetida dio «NO CUMPLE, 3 filas».
  - Hay un worktree de agente colgando de `main`
    (`.claude/worktrees/agent-a5c8651939b29ed59`, `chore/rd-comprobar-002`):
    no se toca.
- **Lo que pinta la portada de la consultora** (`src/app/page.tsx`): `Hero`,
  `Problemas`, `Servicios` (con `consultora.servicios`, cuatro líneas),
  `Soluciones`, `Proceso`, `Proyectos`, `QuienEstudio`, `Faq`, `Contacto`,
  `Hilo` y `AnclaPortada`. Los cinco componentes nuevos viven en
  `src/components/consultora/` (más `EnVista`, `FormularioContacto` y
  `Maquetas`); sus estilos, en `src/estilos/consultora.css`.
- **Contenido** (`src/content/`, 3001 líneas): los que más pesan son
  `diagnostico.ts` (820), `plantillas.ts` (386), `consultora.ts` (318),
  `sectores.ts` (297), `auditoria.ts` (295), `herramientas.ts` (171) y
  `servicios.ts` (121). `hero.ts` (83), `proceso.ts` (76), `portada.ts`
  (51), `cifras.ts` (30), `site.ts` (27) e `interiores.ts` (25) son cortos.
- **Rutas del export** (`src/app`): `/`, `/auditoria/`, `/estudio/`,
  `/herramientas/`, `/plantillas/`, `/privacidad/`, `/sectores/`, las tres
  `/sectores/<slug>/` (D-009) y `404`. `out/` está en `.gitignore`.
- **Rótulos «Ejemplo»** escritos a mano en cada sitio: `Hero.tsx:658`,
  `ChatEjemplo.tsx:65` («Ejemplo · negocio inventado») y las maquetas de
  `Maquetas.tsx`/`Soluciones.tsx`. No hay un atributo común que los marque.
  Las cotas salen de `ui/Cota.tsx` (la pinta `ui/Seccion.tsx:54`).
- **Pruebas que ya hay.**
  - `npm test` = `node --test --experimental-strip-types
    "src/**/*.test.ts"`: 9 ficheros. Los que repiten textos son
    `hero.test.ts` (4 flujos × 3 paradas, cada `clave` dentro de un servicio
    de `servicios.ts`), `portada.test.ts` (cotas y los `dato` de
    `proceso.ts`), `plantillas.test.ts`, `sectores.test.ts` y
    `diagnostico.reglas.test.ts`.
  - `limpieza.test.ts` (002) ya tiene `sinComentarios()` para buscar en
    `src/` sin contar los comentarios: se reutiliza la idea.
  - `scripts/comprobar.mjs` (1746 líneas) es el de la 002: da por hechas las
    siete cotas de la portada vigente, así que en esta rama falla en parte.
    `scripts/comprobar-consultora.mjs` (217 líneas) es el de la portada de la
    consultora; por defecto mira `http://localhost:3100/` y acepta `--url`.
  - `scripts/servir.mjs` sirve `out/` en el 4302 y exporta
    `crearServidor`, `CLAVE_COOKIES` y `CLAVE_CORTINA`.
  - `playwright` 1.63.0 es `devDependency` (D-023). Ninguna dependencia más
    está permitida.
- **Datos personales.** `FormularioContacto.tsx` envía a Supabase
  (`functions/v1/solicitar-auditoria`, el mismo endpoint que la auditoría);
  `privacidad/page.tsx:38` dice que solo recoge datos el formulario de la
  auditoría. `kit/traer-solicitudes.mjs` baja las solicitudes.
- **README**: tiene «La auditoría gratuita» (l.199) y «Qué hay en la web»;
  no tiene todavía el bloque `<!-- 003-anclas -->`.

## 2. Decisiones de diseño (aprobar juntas)

- **PD-1 · Ramas** (spec §6, P-08).
  - `exp/consultora` es la **rama de integración** de la 003. T01 mergea
    `main` en ella (no rebase), le pone su propio upstream y la sube a
    GitHub como `exp/consultora`. Subirla no publica nada: Pages solo sale
    de `main`.
  - Cada tarea con código va en su worktree
    (`../subcon-works-web-ptNN`), con rama `feat/pt-tNN-…` desde
    `exp/consultora`, y PR **contra `exp/consultora`**. Nunca contra `main`.
  - Las tareas de redacción (T02, T04) y las manuales (T03, T05, T11)
    también van en rama y PR, para que los ficheros de la spec tengan un
    solo dueño cada vez.
  - Nada de la 003 llega a `main` en esta spec. Llevar los textos a la
    portada vigente es la tarea aparte de §6, cuando se decida P-08.
- **PD-2 · El Anexo A vive en la spec** (spec §3.3).
  - T02 completa la tabla del §3.3 en `spec.md`: le añade la columna
    **estado** (`por confirmar` / `confirmada` / `corregida`) y las filas
    que salgan de leer cada fichero del §2, siguiendo las series que ya hay
    (A22…, A37…, A46…).
  - Es el único cambio permitido en una spec aprobada, porque la spec lo
    pide así (P-09). Ninguna otra tarea toca el resto de `spec.md`, salvo la
    cabecera en T12.
  - Junto a cada fila de datos personales (A44), una línea por formulario:
    qué guarda, dónde, quién lo ve y cuánto tiempo. Si eso exige decidir
    algo (plazo de borrado), T02 abre una P nueva.
- **PD-3 · Formato de `textos.md`** (spec §3.6).
  - Una tabla por ruta (`## /`, `## /herramientas/`…, `## *` para lo
    común, `## README`), todas con las mismas columnas: ruta · fichero ·
    identificador · texto actual · texto nuevo · motivo · estado.
  - **Texto nuevo** admite dos valores especiales:
    - `(igual)`: no cambia; CA-4 comprueba que el texto actual sigue;
    - `(quitar)`: sale (§3.7); CA-4 comprueba que el texto actual ya no está
      en ese fichero.
  - **Estado**: `propuesta` → `aprobada` o `corregida` (Álvaro lo cambió y
    el texto nuevo ya es el suyo). CA-4 trata `corregida` como `aprobada`.
  - Un `|` dentro de un texto se escribe `\|`. Una variable, `{n}`. Las
    formas cortas (§6) van en su propia fila, con identificador
    `<clave>.corto`.
  - Al principio del fichero, tres apartados antes de las tablas: **la
    promesa** (§3.1), **nombres** (tres propuestas por producto y puerta,
    con la recomendada, P-11) y **decisiones de redacción** que la spec deja
    a `textos.md` (parada del hero que sustituye a «Vigilada cada día», qué
    pasa con «Automatizaciones e inteligencia artificial» si se queda con una
    entrada, «Plantillas propias», «Proyectos»).
- **PD-4 · `scripts/comprobar-textos.mjs`, en dos partes.**
  - **Parte de ficheros** (sin navegador): lee `src/**` (`.ts`, `.tsx`,
    `.css`) sin `*.test.ts` y **sin comentarios** (la misma idea que
    `sinComentarios()` de `limpieza.test.ts`), `README.md` sin el bloque
    `003-anclas`, `textos.md` y `out/**/*.{js,txt}`. Para CA-1, 2, 3, 4, 5 y
    16.
  - **Parte de página** (Playwright, **con JavaScript desactivado**): abre
    cada `out/**/*.html` servido con `crearServidor` (puerto **4303**, para
    no chocar con `comprobar.mjs`) y lee el texto visible y los metadatos
    (`title`, `description`, `og:*`, `alt`, `aria-label`). Para CA-6, 7, 8,
    12 y 17. Sin JS, la web se lee entera (regla de la 002) y no hay nada
    animado ni 3D que pintar.
  - Un navegador, que se cierra en `finally`; 1280×800, escala 1,
    `reducedMotion: 'reduce'`; sin capturas. Antes de lanzarlo, el script
    mira si hay un `chrome-headless-shell.exe` en marcha y, si lo hay, avisa
    y espera (regla de `WEBS NEGOCIOS/CLAUDE.md`).
  - Normaliza a minúsculas y sin tildes, y colapsa espacios y saltos de
    línea.
  - Si `out/` es más viejo que el fichero más nuevo de `src/`, sale con
    `FALLO · build viejo` sin probar nada.
  - Misma forma que `comprobar.mjs`: lista
    `{ id: "CA-1 · …", tarea: "Tnn", pendiente: true, fn }`, una línea
    `OK` / `FALLO` / `PENDIENTE` por comprobación, código 1 con algún
    `FALLO` (y con `--estricto`, también con algún `PENDIENTE`), y
    `--solo <texto>`. Script de `package.json`: `comprobar-textos`.
  - Todas las listas que el script necesita (frases de nivel C, excepciones,
    nombres, cifras, selectores) van **arriba del fichero**, cada entrada con
    su id del Anexo o su motivo. T01 las deja con lo que ya se sabe; T05 las
    completa con lo aprobado.
- **PD-5 · Marcas en el HTML** para que la parte de página no adivine.
  - `data-ejemplo` en el contenedor de cada maqueta o conversación rotulada
    «Ejemplo» (CA-7 y la exclusión de CA-8). El rótulo «Ejemplo» va dentro.
  - `data-numeracion` en lo que es numeración de estructura y no cifra
    (CA-8): cotas, 01-07, P1-P36 y el 404.
  - `data-aviso-inventadas` en el aviso de negocios inventados (CA-6).
  - T01 los pone en los componentes comunes (`ui/Cota.tsx`, `ui/Seccion.tsx`
    si pinta numeración, `not-found.tsx`). El resto, cada tarea en los
    componentes que son suyos (§5 de este plan).
- **PD-6 · Cifras** (spec §3.2 regla 4, CA-8).
  - Es cifra en el texto visible todo número (`\d`) y las palabras de una
    lista cerrada (`uno` a `doce`, `quince`, `veinte`, `treinta`, `cien`,
    `mil`, `mitad`, `gratis`, `gratuito/a`), fuera de `[data-ejemplo]` y
    `[data-numeracion]`.
  - Cada aparición tiene que coincidir con una entrada de `CIFRAS`
    (`{ texto: "{n} plantillas", anexo: "A05" }`; `{n}` = cualquier
    número). Una entrada sin id del Anexo no vale.
  - Fechas legales (actualización de `/privacidad/`, A10) también son
    entradas, con su id.
  - CA-8 comprueba además que cada magnitud (`magnitud: "tiempo-formulario"`)
    tiene un solo valor en todo el sitio.
- **PD-7 · «Diagnóstico» y nombres** (CA-5, CA-17). Se buscan en el texto
  visible y en los metadatos, no en `src/`: `diagnostico.ts`,
  `DiagnosticoRapido` y las rutas son identificadores y no se renombran.
  CA-17 lleva la lista de rutas y selectores donde «diagnóstico» sí puede
  salir (el diagnóstico rápido, D-001).
- **PD-8 · Línea base** (CA-10). Antes de tocar nada, T01 escribe
  `linea-base.md` con la salida resumida (sin rutas de la máquina) de
  `npm run lint`, `npm test`, `npm run build`, `npm run comprobar` y
  `node scripts/comprobar-consultora.mjs --url http://127.0.0.1:4302/` sobre
  `out/` servido por `npm run servir`. «No empeorar» = ninguna línea que
  esté en `OK`/`ok` en la línea base pasa a `FALLO`/`FALLA`. Las que ya
  fallan se apuntan y no se arreglan en esta spec.
- **PD-9 · Quién toca cada fichero.** Solo T04 escribe `textos.md` (y T05
  cambia su columna de estado). Las tareas de código copian de él y **no lo
  editan**: si un texto no cabe o no cuadra, lo dicen en su PR y se resuelve
  en una corrección de `textos.md` (T05 reabierta), no en el código. Un
  fichero de §5 tiene una sola tarea dueña; los tests van con su fichero.

## 3. Orden de construcción

```
T01 rama + línea base + comprobar-textos (todo pendiente)
 └─ T02 Anexo A completo (Opus)
     └─ T03 Álvaro confirma el Anexo (P-09, P-10, P-13)       ← manual
         └─ T04 textos.md (Opus, un solo chat)
             └─ T05 Álvaro aprueba textos.md y nombres (D-033) ← manual
                 ├─ T06 servicios, hero y herramientas ┐
                 ├─ T07 portada de la consultora        │ en paralelo
                 ├─ T08 interiores, privacidad, README  │ (ficheros sin
                 └─ T09 sectores y diagnóstico          ┘  cruzarse)
                     └─ T10 barrido y comprobaciones globales
                         └─ T11 lectura de Álvaro (CA-9, 11, 13, 14, 15) ← manual
                             └─ T12 Comprobar la spec y consolidar deltas
```

T02 a T05 son un camino único: la spec prohíbe escribir texto con filas
«por confirmar» (§3.3) y copiar al código antes de D-033 (§3.6).

## 4. Datos

Ninguna tabla, migración ni almacenamiento nuevo. Ficheros nuevos:
`specs/003-posicionamiento-y-textos/{linea-base,textos,comprobacion}.md` y
`scripts/comprobar-textos.mjs`. Si T02 descubre que hace falta decidir algo
de datos personales (plazo de conservación de las solicitudes), va como P
nueva y bloquea solo CA-14.

## 5. Partes del código (dueño de cada fichero)

| Tarea | Ficheros |
|---|---|
| T01 | `scripts/comprobar-textos.mjs`, `package.json` (script), `ui/Cota.tsx`, `ui/Seccion.tsx`, `not-found.tsx` (solo `data-numeracion`), `linea-base.md` |
| T02 | `spec.md` §3.3 (Anexo A); `DECISIONES.md` si abre una P |
| T04 | `textos.md` |
| T05 | `textos.md` (estado), listas de arriba de `comprobar-textos.mjs`, `DECISIONES.md` |
| T06 | `servicios.ts`, `hero.ts`, `hero.test.ts`, `herramientas.ts`, `herramientas/page.tsx`, `sections/Hero.tsx`, `sections/Servicios.tsx` |
| T07 | `consultora.ts`, `components/consultora/*`, `portada.ts`, `proceso.ts`, `cifras.ts`, `portada.test.ts`, `sections/Proceso.tsx` |
| T08 | `site.ts`, `layout.tsx`, `interiores.ts`, `estudio.ts`, `auditoria.ts`, `plantillas.ts` (solo textos), `plantillas.test.ts`, `src/app/{auditoria,estudio,plantillas,privacidad}/page.tsx`, `not-found.tsx` (textos), `components/layout/{Nav,Footer,AvisoCookies}.tsx`, `components/auditoria/*`, `components/plantillas/*`, `ui/TarjetaPlantilla.tsx`, `README.md` |
| T09 | `sectores.ts`, `diagnostico.ts`, `sectores.test.ts`, `diagnostico.reglas.test.ts`, `src/app/sectores/**`, `components/sectores/*`, `components/diagnostico/*`, `sections/DiagnosticoRapido.tsx` |
| T10 | cualquier fichero con texto que pinte una ruta del export y no esté en esta tabla, y las comprobaciones globales. Lo que solo pinta la portada vigente (`Equipo`, `Compromisos`, `QuienDebajo`, `Fondo`, `Plantillas`) no entra (spec §2) |

Cada tarea de código pone `pendiente: false` solo en sus comprobaciones de
`comprobar-textos.mjs`. Es un fichero compartido: los cambios son líneas
sueltas y se mergean sin choque, pero dos tareas no reordenan ni reescriben
la lista.

## 6. Riesgos y cómo se cubren

- **Afirmar lo que no existe** (Ley 3/1991 art. 5, spec §5). Lo cubren los
  niveles del Anexo confirmados por Álvaro antes de redactar (T03), CA-2/3
  automáticos y la lectura de paráfrasis de T11 (CA-13).
- **`textos.md` demasiado grande para un chat.** T04 lo escribe por rutas y
  commitea al acabar cada `##`. Si el chat se va a resumir, para en un `##`
  terminado y deja el prompt para seguir; el siguiente chat sigue en el mismo
  fichero (sigue habiendo un solo escritor a la vez).
- **Falsos positivos del script** (identificadores, comentarios, JS de
  Next). PD-4 quita comentarios y mira el texto visible donde importa; PD-7
  saca «diagnóstico» de `src/`. Una excepción nueva lleva motivo y la ve
  T12.
- **`hero.test.ts` y la parada nueva.** `textos.md` dice qué parada
  sustituye a «Vigilada cada día» y de qué servicio sale; T06 cambia
  `hero.ts` y `servicios.ts` juntos, en el mismo commit.
- **La portada vigente se queda atrás** (P-08). Se acepta: la 003 se cierra
  en `exp/consultora`; la portada de `main` sigue con los textos viejos
  hasta la tarea aparte, y eso se dice en la PR de T12.
- **El build viejo engaña al script.** PD-4 compara fechas de `out/` y
  `src/`.
- **Saturar el PC.** Un solo Playwright a la vez, JS desactivado, sin
  capturas; `comprobar-textos`, `comprobar` y `comprobar-consultora` nunca a
  la vez.

## 7. Queda fuera

- Llevar los textos a la portada vigente y mergear en `main` (P-08).
- La spec 004 (vigilancia y ficha de Google, P-12). Su última tarea pone
  `VIGILANCIA_EXISTE=true` en el script.
- Diseño y maquetación (carriles 1 y 2), salvo el texto de las maquetas.
- Regenerar `og.png` (P-07), precios y cifras nuevas, traducciones.
- Arreglar lo que ya falla en `linea-base.md`.
