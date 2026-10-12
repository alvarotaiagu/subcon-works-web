# 001 · Comprobación de la spec

Fecha: 2026-10-12 · Modelo: Sonnet 5.5 · Base: `main` en `3166475` (T01-T14 mergeadas; T15 pendiente)

La spec no tiene un §10: los criterios son «Hecho cuando» y la lista de
«Comprobación en navegador» del §7, más las reglas con número de los §3, §5
y §6. Los textos aún no revisados por Álvaro (P-03, T15) no cuentan como «no
cumple»; van como «pendiente de P-03 (T15)».

Cómo se comprobó:

- **Tests**: `npm test` (Node 22.17.1, `node --test --experimental-strip-types`).
- **Build**: `npm run lint`, `npm run build` y HTML de `out/`.
- **Navegador**: Playwright (Chromium) a 390 y 1440 px (y 360 px para el
  desbordamiento), sobre `out/` servido en el puerto 4391 (`<title>` de la web
  comprobado), con contextos nuevos para la cortina en frío y `mouse.wheel`
  para el scroll. Segunda pasada con `GITHUB_ACTIONS=true` servido bajo
  `/subcon-works-web/` (puerto 4393) y pasada de la auditoría en `next dev`
  (4392, StrictMode). Los scripts quedaron fuera del repo.

## Resumen

Todo cumple. Ningún test pendiente. Queda pendiente de P-03 (T15) la revisión
de textos, que es manual. Sin `Cambios pendientes: 001` en ninguna spec: no
hay deltas que consolidar.

## Tabla

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| `npm run lint` pasa | ejecutado | cumple | sin avisos |
| `npm run build` pasa | ejecutado (normal y con `GITHUB_ACTIONS=true`) | cumple | 16 páginas; genera `/sectores/` y las tres de sector |
| `npm test` pasa, ninguno pendiente | ejecutado; `grep` de skip/todo/fixme | cumple | 54 pasan, 0 fallan, 0 skipped, 0 todo; el recorrido exhaustivo tarda unos 6 s en total |
| Recorrido exhaustivo: 3-5 mejoras, sin repetir, aplicables, `porque` no vacío (§7) | test de `diagnostico.reglas.test.ts` | cumple | un solo `test()`, dos contextos |
| Enlaces en lista blanca; anclas solo en `sector` (§7) | test | cumple | |
| Slugs de plantilla existen en `plantillas.ts` (§7, §6) | test de `sectores.test.ts` | cumple | |
| URL: round-trip y muestra (`constructor`, `__proto__`, `toString`, `v` desconocida, sin `v`, `canales` repetidos) (§3.5, §7) | tests de `diagnostico.url.test.ts` + en navegador `?reserva=__proto__`, `?s=constructor&reserva=toString`, `?v=2&s=dental` | cumple | en el navegador se ignoran los valores, abre la primera pregunta y no hay errores de página |
| Textos de auditoría: solo claves P existentes, marca « (del diagnóstico rápido)», sin copiar la query (§3.1, §5, §7) | tests de `diagnostico.auditoria.test.ts` | cumple | |
| `mezclarConBorrador` no pisa, recuentos cuadran (§3.6, §7) | tests | cumple | |
| §3.1 `dolor=agenda` con `sin-cita` se descarta; `plataformas` solo en `rural` (§6) | tests + en navegador `?s=dental&reserva=sin-cita&dolor=agenda&…` abre en la pregunta 7 sin responder; `?s=rural&reserva=plataformas` abre en la 2 | cumple | |
| §3.2 Una pregunta por pantalla, «n de N» y barra; 7 en portada y 6 en sector | navegador, `progressbar` (`aria-valuemax`) | cumple | 7 en portada, 6 en las tres páginas de sector |
| §3.2 Tocar avanza; las de varias llevan «Seguir»; «Atrás» conserva; «Cambiar respuestas» vuelve con todo marcado | navegador, 390 y 1440 | cumple | tras «Cambiar respuestas» queda 1 marcada y la URL sin query |
| §3.2 El foco va al título de la pregunta | lectura de `PasoPregunta.tsx` (`tabIndex={-1}`) | cumple | no se midió el foco en navegador |
| §3.3 Resultado: título con el sector, 3-5 mejoras con porqué, línea única de agencia, tres acciones | navegador, 390 y 1440 | cumple | 4 mejoras con el ejemplo de la spec |
| §3.3 «Copiar el enlace» copia la URL canónica con origen y basePath | navegador, leyendo el portapapeles | cumple | `…/sectores/clinicas-dentales/?v=1&…#diagnostico` desde un diagnóstico de la portada; con `/subcon-works-web` delante en la pasada de Pages |
| §3.3 Fallo del portapapeles: URL seleccionada a mano | lectura de `Resultado.tsx` (campo de solo lectura) | no comprobable | no se forzó el fallo del portapapeles |
| §3.5 La query solo se escribe al llegar al resultado; incluye `v` y `s`, también en sector | navegador | cumple | en sector sale `s=dental`, `s=rural` y `s=despachos` |
| §3.5 Query completa en pestaña nueva: resultado directo y salto a `#diagnostico` tras la cortina | navegador, contextos nuevos, muestreo de `scrollY` cada segundo | cumple | `scrollY` se queda en 0 mientras dura la cortina y baja después (3-7 s); `#diagnostico` queda a 112 px del borde. Con la carga seguida de 6 s de espera el salto aún no había terminado en una pasada; con muestreo largo sale siempre |
| §3.5 Query incompleta: primera sin responder, con las anteriores marcadas | navegador | cumple | |
| §3.5 `s` distinto del de la página: manda la página | navegador (`/sectores/alojamientos-rurales/?s=dental&…`) | cumple | |
| §3.6 Aviso con el número y «no las hemos tocado» | navegador, build y `next dev` | cumple | «Hemos puesto 7 respuestas…» y, con P7 previa, 6 y «Las que ya habías escrito no las hemos tocado»; con StrictMode igual |
| §3.6 P7, P14, P35 y «A qué os dedicáis» (P2) rellenos y siguen rellenos; sector de contacto «Clínica dental» | navegador y borrador en `localStorage` | cumple | |
| §3.6 URL de `/auditoria/` sin parámetros después | navegador, build y dev | cumple | |
| §3.6 Recargar no los vuelve a poner si se borraron | navegador (borrar P7, recargar) | cumple | |
| §3.6 P7 escrita previamente queda intacta | navegador | cumple | |
| §3.6 `localStorage` bloqueado: el prerrelleno funciona | lectura del efecto de `FormularioAuditoria.tsx` | no comprobable | no se probó con el almacenamiento bloqueado en navegador |
| §3.7 Sección `#diagnostico` en la portada con la fila «Por sector» | navegador y HTML de `out/` | cumple | los enlaces de `out/` llevan prefijo en la pasada de Pages |
| §3.8 Tres páginas de sector y `/sectores/`; orden de los bloques | HTML de `out/`, ids `diagnostico`, `asistente`, `plantillas-sector` | cumple | |
| §3.8 Diagnóstico sin pregunta de sector | navegador, tres páginas | cumple | |
| §3.8 `#asistente` con «Ejemplo · negocio inventado» | navegador, tres páginas | cumple | |
| §3.8 Bloque de plantillas: sale en `rural` y `despachos`, no existe en `dental`; aviso igual al de `/plantillas/` | navegador y lectura de `PlantillasSector.tsx` | cumple | el texto del aviso es idéntico al de `src/app/plantillas/page.tsx` |
| §3.8 Conversaciones de 6 a 10 mensajes; solo lo que hace hoy el motor; datos inventados | lectura de `sectores.ts` + test | cumple | dental con urgencia derivada a una persona; rural y despachos recogen contacto y no consultan ni reservan. «Clínica Dental Demo», `981 000 000` |
| §3.8 Metadatos: `title`, `description` y noindex en las páginas nuevas | HTML de `out/` | cumple | `/sectores/` y las tres de sector llevan noindex |
| §3.9 `<noscript>` con el enlace a la auditoría | HTML de `out/` | cumple | en la portada y en las tres de sector |
| §3.9 Animaciones con `prefers-reduced-motion` | lectura de código (`ChatEjemplo`, barra de progreso) | cumple | no se probó con la emulación de movimiento reducido |
| §3.9 Enlaces internos con `Link`/`withBasePath` | `grep` de `href="/` y HTML de `out/` con prefijo | cumple | |
| §4 El diagnóstico no guarda nada | navegador: `localStorage` y cookies antes/después de responder | cumple | |
| §5 `/privacidad/` lleva la línea del diagnóstico | HTML de `out/` | cumple | |
| §5 Sin cifras inventadas | `grep` de porcentajes y cifras en `diagnostico.ts` y `sectores.ts` | cumple | |
| §6 Móvil a 360 px: sin scroll horizontal | navegador, `/`, `/sectores/`, `/auditoria/`, `/privacidad/` | cumple | y las tres de sector a 390 y 1440 |
| §6 Ruta de sector inexistente: 404 | `dynamicParams = false`; `out/sectores/` solo tiene los tres slugs | cumple | no se abrió una URL inexistente en Pages |
| §6 `basePath` en Pages: enlaces y URL copiada con prefijo | build con `GITHUB_ACTIONS=true`, servido bajo `/subcon-works-web/` | cumple | misma batería de navegador que la normal |
| Hecho cuando: textos revisados por Álvaro (P-03) | — | pendiente de P-03 (T15) | incluye comprobar que ninguna mejora prometa lo que el asistente no hace. A la vista: los textos de `reservas-online`/`reservas-directas` hablan del «sistema de citas» (no del asistente) |

## Notas para la revisión P-03

- Las descripciones de `/sectores/clinicas-dentales/` («la ficha del paciente
  antes de la primera visita») y de `/sectores/alojamientos-rurales/` («el
  registro de viajeros antes de la llegada») nombran cosas que no están en el
  catálogo de mejoras. Conviene que Álvaro confirme que son algo que se puede
  montar.
- Las dos últimas del `relleno` de cada sector siguen siendo borrador (§3.4).
