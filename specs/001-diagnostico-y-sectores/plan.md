# 001 · Plan · Diagnóstico rápido y páginas por sector

Spec: [spec.md](spec.md) (aprobada, D-011) · Tareas: [tasks.md](tasks.md)
Estado del plan: **aprobado** (D-012, 2026-10-11), con PD-1 a PD-11.

## 1. Punto de partida (leído en el código, 2026-10-11)

- La rama `spec/diagnostico-sectores` sale de `6b7c5b6`. `origin/main` ya va
  por `33b2974` (merge de `feat/en-persona`): la portada tiene `Equipo` y
  `Compromisos` antes de `Auditoria`, y hay `/estudio/`. **El `main` local
  está atrasado** (`a6b13f9`); no sirve de base.
- `feat/chatbot` (carpeta principal, con cambios sin commitear) toca
  `src/app/page.tsx`, `src/app/privacidad/page.tsx`, `tsconfig.json`,
  `src/app/layout.tsx`, `next.config.ts` y una línea de comentario de
  `Preloader.tsx`. Es la única rama viva que choca con esta spec.
  `feat/en-persona` ya está en `origin/main`: la nota de coordinación de la
  spec (§8) se queda en «solo `feat/chatbot`».
- **Cortina.** `Preloader.tsx` dispara `PRELOADER_DONE_EVENT` cuando el
  contador llega a 100, **antes** del golpe de encaje y del obturador (~1 s).
  El `document.body.style.overflow = ""` va en el `onComplete` de la
  timeline, después. Un salto hecho al recibir `DONE` cae con el `body` aún
  en `overflow:hidden` (ver PD-2).
- **Saber si la cortina sale.** Preloader marca `sessionStorage` en su
  `useLayoutEffect`, que corre antes que cualquier `useEffect` del
  diagnóstico: mirar `sessionStorage` desde el diagnóstico siempre dice «ya
  vista». Hace falta un estado propio (PD-2).
- **Lenis.** `useLenis()` crea la instancia dentro de un efecto y no la
  expone. Con `prefers-reduced-motion` no hay Lenis (PD-3).
- **Anclas.** Las secciones usan `scroll-mt-28`. Nadie hace hoy un salto
  programático con Lenis.
- **Auditoría.** `FormularioAuditoria.tsx`: el borrador se lee en el
  `useEffect` de las líneas 62-84 y se guarda en el de las 86-93. El tipo
  `Contacto` es local al componente (`sector` es un campo suyo). Las P que
  prerrellena la spec existen en `auditoria.ts`: P2, P7, P10, P12, P14, P23,
  P35.
- **Contenido.** `plantillas.ts`, `herramientas.ts` y `auditoria.ts` no
  importan nada: los tests de Node los pueden cargar tal cual. Ids de
  `herramientas.ts`: `tiendas`, `informe`, `vigilancia`, `ficha-google`,
  `formularios`. Slugs de plantillas que cita la spec (`hotel-rural`,
  `abogados-trinquete`, `abogados-portico`, `abogados-contraluz`): existen.
- **Pruebas.** No hay ejecutor de tests. Node local: 22.17.1 (strip-types
  con bandera). CI con Node 20 y solo `npm run build`. El push a `main`
  **publica** en GitHub Pages.
- `CtaFinal` no tiene props, apunta a `/auditoria/` y lleva
  `id="contacto"`. `sitemap.ts` devuelve `[]` y `robots.ts` bloquea todo: no
  hay nada que añadir ahí.
- `recepcionista-ia` está en `C:\Users\alvar\Desktop\Proyectos\recepcionista-ia`
  (fuera del repo): `src/clients/clinica-demo.json` y el guion de pruebas
  del README (urgencia → derivación, sin diagnóstico). WhatsApp «fase 2, sin
  probar», sin recordatorios.

## 2. Decisiones de diseño (aprobar juntas)

- **PD-1 · Ramas y publicación.**
  - Se rebasa `spec/diagnostico-sectores` sobre `origin/main` y de ahí sale
    la rama de integración `feat/diagnostico-sectores`.
  - Cada tarea va en su worktree, con su rama desde la de integración, y su
    PR **contra la de integración**, no contra `main`.
  - A `main` va una sola PR al final, cuando esté cerrada P-03. El motivo:
    `main` publica, y P-03 bloquea la publicación.
- **PD-2 · Fin de la cortina** (corrige el §3.5 de la spec).
  - `Preloader.tsx` exporta `PRELOADER_GONE_EVENT = "undertactics:preloader-gone"`.
    Se dispara en el `onComplete`, justo después de quitar `overflow`, y
    también en el cleanup si la timeline se mata a medias.
  - Exporta también `esperarCortina(): Promise<void>`, que se resuelve en el
    acto si la cortina no está en curso, o con `GONE` si lo está. El estado
    se guarda en una variable del módulo, que el `useLayoutEffect` pone a
    `true` cuando la cortina sale y el `onComplete` o el cleanup a `false`.
  - `PRELOADER_DONE_EVENT` no cambia (el H1 del hero lo sigue usando).
  - En la spec, el §3.5 pasa a decir «al terminar la cortina
    (`esperarCortina()`)».
- **PD-3 · Saltos con Lenis.**
  - `useLenis.ts` guarda la instancia en una variable del módulo y exporta
    `getLenis(): Lenis | null` (`null` tras `destroy` o con reduced-motion).
  - Nuevo `src/lib/irAAncla.ts` con `irAAncla(el: HTMLElement)`:
    - con Lenis, `lenis.scrollTo(el, { offset: -scrollMarginTop })`, leyendo
      `getComputedStyle(el).scrollMarginTop`;
    - sin Lenis, `el.scrollIntoView({ block: "start" })` sin `smooth`.
- **PD-4 · Lectura de la query.**
  - Se lee `window.location.search` en un `useEffect`, una vez, guardada en
    una `ref`. No se usa `useSearchParams`, así que no hace falta `Suspense`.
  - Lo prerrenderizado es siempre la primera pregunta. Es el mismo patrón que
    el borrador de la auditoría (con el mismo
    `eslint-disable react-hooks/set-state-in-effect`).
  - La tarea confirma esto en `node_modules/next/dist/docs/` antes de
    escribir. Si la guía de Next 16 lo desaconseja, para y lo dice (C-xx).
- **PD-5 · Reglas declarativas.**
  - Cada regla es `{ mejora, si: { pregunta, en: Codigo[] }, prioridad,
    porque }`: **una** condición por regla. Una mejora con dos disparadores
    son dos reglas, cada una con su porqué.
  - La condición se cumple si la respuesta (o, en `canales`, alguno de los
    marcados) está en `en`.
  - Los datos son comprobables: un test verifica que cada código citado
    existe en su pregunta.
- **PD-6 · Dónde va cada cosa.**
  - `src/components/diagnostico/`: `Diagnostico.tsx` (cliente),
    `PasoPregunta.tsx` y `Resultado.tsx`.
  - `src/components/sectores/`: `CabeceraSector`, `ProblemasSector`,
    `MejorasSector`, `ChatEjemplo`, `PlantillasSector` y `TarjetaSector`
    (esta la usa `/sectores/`).
  - Sección de portada: `src/components/sections/DiagnosticoRapido.tsx`.
- **PD-7 · Cierre de las páginas de sector.** `<CtaFinal />` tal cual, sin
  props nuevas. Su texto ya habla de la auditoría.
- **PD-8 · Tests en cuatro ficheros**, para que las tareas de lógica no se
  pisen al añadir tests:
  - `src/lib/diagnostico.reglas.test.ts`;
  - `src/lib/diagnostico.url.test.ts`;
  - `src/lib/diagnostico.auditoria.test.ts`;
  - `src/content/sectores.test.ts`.

  Script: `"test": "node --test --experimental-strip-types \"src/**/*.test.ts\""`.
- **PD-9 · Playwright fuera del repo.** No se añade la dependencia. El
  script de comprobación vive en el scratchpad de quien prueba, se ejecuta
  con el Playwright de la máquina y su resumen se pega en la PR.
- **PD-10 · ScrollTrigger tras cambiar de alto.**
  - El diagnóstico cambia de alto al pasar de pregunta a resultado, y debajo
    tiene secciones con `useReveal`/ScrollTrigger (Auditoría, Cifras, CTA).
  - Un `ResizeObserver` sobre el componente llama a `ScrollTrigger.refresh()`,
    con 150 ms de espera para no llamar en cada cambio.
- **PD-11 · Aviso de prerrelleno en la auditoría.**
  - Sale encima del `<form>` en cualquier paso, no solo en el 0 como
    «Recuperado lo que habías escrito».
  - Vive en el estado de React hasta recargar o enviar. No se guarda.

Aprobado como D-012. El §3.5 de la spec ya está corregido por PD-2
(`Cambiada por: D-012` en su cabecera).

## 3. Orden de construcción

```
T01 base ──┬─ T02 preguntas ─ T03 reglas ─ T04 URL ─ T05 auditoría (lógica) ─┬─ T13 formulario + privacidad
           │        │            └─ T06 sectores.ts ─ T10 chat ─┐            │
           │        └─ T08 componente (preguntas) ─┐            │            │
           └─ T07 cortina + Lenis ─────────────────┴─ T09 resultado ─┬─ T11 páginas de sector
                                                                     └─ T12 portada
                                              T14 navegador (todo) ─ T15 cierre (P-03, PR a main)
```

- **En serie por fichero que crece**: T02 → T03 → T04 → T05 añaden a
  `src/content/diagnostico.ts` y `src/lib/diagnostico.ts`.
- **En paralelo**:
  - T07 desde el principio.
  - T08 en cuanto esté T02.
  - T06 en cuanto esté T03, junto a T04 y T05.
  - T13 en cuanto esté T05, junto a T09-T12.
  - T11 y T12 a la vez.

## 4. Datos

Nada de base de datos, migraciones ni almacenamiento nuevo (spec §4). El
único almacenamiento que se toca es el borrador `undertactics:auditoria:v1`, con
el mismo formato.

## 5. Partes del código

| Fichero | Qué | Tarea |
|---|---|---|
| `package.json`, `tsconfig.json` | script `test`; `allowImportingTsExtensions` | T01 |
| `src/content/diagnostico.ts` | tipos, preguntas, sectores (códigos y nombres), mejoras, reglas, relleno, textos de prerrelleno | T02-T05 |
| `src/lib/diagnostico.ts` | `preguntasPara`, `respuestaValida`, `diagnosticar`, `resolverEnlace`, `codificar`, `decodificar`, `urlCanonica`, `aRespuestasAuditoria`, `mezclarConBorrador` | T02-T05 |
| `src/content/sectores.ts` | las tres páginas: slug (D-009), textos, mejoras elegidas, conversación, plantillas | T06 |
| `src/components/layout/Preloader.tsx`, `src/hooks/useLenis.ts`, `src/lib/irAAncla.ts` | PD-2, PD-3 | T07 |
| `src/components/diagnostico/*` | componente | T08-T09 |
| `src/components/sectores/*`, `src/app/sectores/**` | páginas | T10-T11 |
| `src/components/sections/DiagnosticoRapido.tsx`, `src/app/page.tsx` | portada | T12 |
| `src/components/auditoria/FormularioAuditoria.tsx`, `src/app/privacidad/page.tsx` | prerrelleno, línea de privacidad | T13 |

**Imports.** `src/lib/diagnostico.ts`, `src/content/diagnostico.ts`,
`src/content/sectores.ts` y los tests se importan entre sí con rutas
relativas y extensión `.ts`, y los tipos con `import type` (spec §7). Ninguno
puede importar nada con `@/` ni nada que lea `process.env`. Por eso
`urlCanonica` recibe `origen` y `basePath` como parámetros.

## 6. Riesgos y cómo se cubren

| Riesgo | Cobertura |
|---|---|
| Salto a `#diagnostico` perdido o a medias por la cortina | PD-2; prueba en navegador en frío (sessionStorage vacío) y en caliente |
| Salto que cae mal por los pins de Proceso/Plantillas | `irAAncla` mide en el momento del salto, tras pintar el resultado (doble `requestAnimationFrame`) y tras `ScrollTrigger.refresh()` |
| ScrollTrigger de las secciones de abajo con posiciones viejas | PD-10 |
| StrictMode aplica el prerrelleno dos veces o lo pisa con el borrador viejo | query en `ref`, mezcla idempotente con lo leído de `localStorage`; prueba en `next dev` (spec §7) |
| Inyección de texto en la auditoría por URL | el texto sale siempre de `diagnostico.ts`; test de que `aRespuestasAuditoria` no copia nada de la query |
| `objeto[valor]` devuelve funciones del prototipo | `Map`/`Set`/`Object.hasOwn`; test con `constructor`, `__proto__`, `toString` |
| Enlaces sin `basePath` en Pages | `Link` o `withBasePath`; T14 hace una pasada con `GITHUB_ACTIONS=true` y `out/` servido bajo `/subcon-works-web/` |
| Una mejora que promete lo que el asistente no hace | regla escrita en T03/T06/T10; revisión P-03 en T15 |
| Choque con `feat/chatbot` en `page.tsx`, `privacidad`, `tsconfig.json`, `Preloader.tsx` | cambios mínimos y localizados; T15 mira el orden de merge |
| Node 20 en CI no corre `npm test` | `npm test` es local (spec §7); el build de CI no carga los `.test.ts` como módulos (solo los tipa) |

## 7. Queda fuera

Lo de la spec §2 («Queda fuera»): chat en vivo, plantilla dental (P-01),
alta de las de asesoría (P-02), analítica, más sectores, kit 03 y Supabase.
Y de este plan: arreglar la web sin JS (spec §3.9) y cambiar el CI.
