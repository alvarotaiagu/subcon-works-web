# 003 · Línea base

Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md) (PD-8) · Tarea: T01

Medida **antes de tocar código**, el 2026-11-01, en la rama `exp/consultora` con `main`
mergeado, commit `b346a4c`. Instalación con `npm ci`; `out/` sale de `npm run build`.
Las comprobaciones con navegador se lanzaron una tras otra (Playwright, escala 1).

**Regla (CA-10):** «no empeorar» = ninguna línea que esté en `OK` aquí pasa a `FALLO`.
Lo que ya falla se apunta y **no se arregla en esta spec**.

## Resumen

| Comprobación | Resultado |
|---|---|
| `npm run lint` | `OK` · sin avisos |
| `npm test` | `OK` · 66 pruebas, 66 pasan, 0 fallan |
| `npm run build` | `OK` · 16 páginas estáticas (`/`, `/auditoria`, `/estudio`, `/herramientas`, `/plantillas`, `/privacidad`, `/sectores`, 3 sectores, `_not-found`, `robots.txt`, `sitemap.xml`, `apple-icon.png`) |
| `npm run comprobar` | 17 `OK` · 10 `FALLO` · 0 pendientes (sale con 1) |
| `node scripts/comprobar-consultora.mjs --url http://127.0.0.1:4302/` | 19/22 `OK` · 3 `FALLO` (sale con 1) |

`comprobar.mjs` es el de la 002 y da por hechas las siete cotas de la portada vigente: en
esta rama falla en parte, como avisa el plan. `comprobar-consultora.mjs` se lanzó contra
`out/` servido con `npm run servir` (su valor por defecto es el servidor de desarrollo).

## `npm run comprobar`

- `FALLO` · T06 · §7 · Portada · siete secciones con cota, sin Marquee/Cifras/CtaFinal
- `OK` · T03 · §7 · Portada · letras: nada de Google Fonts, se piden los dos woff2
- `OK` · T03 · §7 · basePath de las letras (build con GITHUB_ACTIONS=true)
- `OK` · T09 · §7 · Cortina · cuándo sale y cuándo no
- `OK` · T09 · §7 · Cortina · ni un fotograma cuando no sale
- `OK` · T09 · §7 · Cortina · misma y que la superficie (±1 px)
- `OK` · T09 · §7 · Cortina · se retira con los chunks abortados
- `OK` · T12 · §7 · Sin JS
- `OK` · T07 · §7 · Hero · encender cada pozo y «Ejemplo»
- `FALLO` · T07 · §7 · Hero · a 360 px, nada solapado, recortado ni < 12 px
- `FALLO` · T07 · §7 · LCP · área del titular > descripción a 390 px
- `OK` · T07 · §7 · Cabecera · logo claro y oscuro
- `OK` · T08 · §7 · Hero · inactividad (5 s, una vuelta, 15 s, Pausar)
- `OK` · T08 · §7 · Hero · aria-live solo tras un gesto
- `OK` · T08 · §7 · Hero · tirador táctil y scroll fuera de él
- `OK` · T08 · §7 · Foco
- `OK` · T12 · §7 · Proceso · broca y pasos; tabla con movimiento reducido
- `FALLO` · T13 · §7 · Fondo · se enciende en la portada y en /sectores/alojamientos-rurales/
- `FALLO` · T14 · §7 · Hilo
- `OK` · T15 · §7 · Interiores
- `OK` · T15 · §7 · Sin scroll horizontal a 360 y 390 px
- `FALLO` · T16 · §7 · 001 sigue cumpliendo
- `FALLO` · T17 · §7 · Mando
- `FALLO` · T17 · §7 · Fondo y proceso en Sobria
- `OK` · T17 · §7 · Contraste real
- `FALLO` · T18 · §7 · Glifos: ningún texto visible con ← → ★ ↕ (PD-4)
- `FALLO` · D-028 · §6 · Sin GSAP: chunks de GSAP y Lenis abortados

## `node scripts/comprobar-consultora.mjs --url http://127.0.0.1:4302/`

- `OK` · 1440: las nueve secciones, en orden, y un solo H1
- `OK` · 1440: sin desbordamiento horizontal
- `OK` · 1440: titular del hero a cada lado de la superficie
- `OK` · 1440: imágenes con alt y anclas internas que existen
- `OK` · 1440: FAQ se abre y se cierra con teclado
- `FALLO` · 1440: sin errores de consola
- `OK` · 768: las nueve secciones, en orden, y un solo H1
- `OK` · 768: sin desbordamiento horizontal
- `OK` · 768: titular del hero a cada lado de la superficie
- `OK` · 768: imágenes con alt y anclas internas que existen
- `OK` · 768: FAQ se abre y se cierra con teclado
- `FALLO` · 768: sin errores de consola
- `OK` · 390: las nueve secciones, en orden, y un solo H1
- `OK` · 390: sin desbordamiento horizontal
- `OK` · 390: titular del hero a cada lado de la superficie
- `OK` · 390: imágenes con alt y anclas internas que existen
- `OK` · 390: FAQ se abre y se cierra con teclado
- `FALLO` · 390: sin errores de consola
- `OK` · Formulario · vacío: muestra los errores y no envía
- `OK` · Formulario · válido: manda el mapeo esperado y confirma
- `OK` · Formulario · sin red: aviso con salida por correo y datos conservados
- `OK` · Entrada con movimiento · los ejemplos terminan a la vista y el proceso llega al paso 06
