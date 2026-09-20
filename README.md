# subcon-works-web

Web del estudio **Subcon Works**: diseño y desarrollo web, automatización y IA
para negocios pequeños de Galicia.

Next.js 16 con `output: "export"`, publicada como *project site* de GitHub Pages
en `alvarotaiagu.github.io/subcon-works-web/`. Movimiento con GSAP + Lenis y
tres escenas de Three.js (engranajes del hero, malla de nodos, blob del cierre).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export estático en out/
npm run lint
```

El `basePath` solo se activa en el build de CI (`GITHUB_ACTIONS=true`), para que
`next dev` siga sirviendo en la raíz.

## Qué hay en la web

| Sección | Contenido |
|---|---|
| Hero | Engranajes WebGL y la cortina de entrada |
| Servicios | Los ocho servicios de `src/content/servicios.ts`, con su icono de línea |
| Plantillas | Las 10 destacadas en carrusel horizontal anclado, y las 30 en `/plantillas/` |
| Proceso | Los seis pasos, anclados con scrub |
| Auditoría | La oferta de la auditoría gratuita, que lleva a `/auditoria/` |
| Cifras | Contadores con anillo, todos comprobables |
| Cierre | Blob WebGL y llamada final |

Páginas: `/` · `/plantillas/` · `/auditoria/` · `/privacidad/`.

## Dos cosas que no se tocan

**Nada se indexa.** `robots.ts` bloquea el rastreo entero y todas las páginas
llevan `meta robots noindex`. Es la norma de la casa mientras no haya nada
vendido.

**No hay clientes.** La web no presenta ningún caso de cliente porque todavía no
los hay. Lo que se enseña son las **30 plantillas** del taller
(`plantillas-negocios-web`), y todas protagonizadas por **negocios inventados**
— eso se dice con todas las letras en la sección, en `/plantillas/` y en el pie.
Cuando entre el primer cliente real, ese es el momento de añadir una sección de
trabajos, no antes.

## El contenido vive en `src/content/`

| Archivo | Qué manda |
|---|---|
| `site.ts` | Nombre, contacto, navegación |
| `servicios.ts` | Los ocho servicios y lo que incluye cada uno |
| `plantillas.ts` | El catálogo de 30, con su demo y su captura |
| `proceso.ts` | Los seis pasos |
| `cifras.ts` | Los cuatro contadores |
| `auditoria.ts` | Las 36 preguntas del cuestionario, P1–P36 |

Las capturas de `public/plantillas/*.jpg` son fotos reales de cada demo, tomadas
con Playwright a 1440×960 después de que se retire la cortina de entrada y se
acepte su aviso de cookies.

Los iconos de `public/servicios/*.svg` se generan con
`node scripts/generar-iconos-servicios.mjs`.

## La auditoría gratuita

`/auditoria/` es el cuestionario del kit **`03-kit-auditoria-negocio`** llevado a
la web: las mismas 36 preguntas con la misma numeración, en ocho pasos, con
borrador guardado en el navegador y con la posibilidad de mandarlo a medias.

Al enviarse va a una Edge Function de Supabase (`solicitar-auditoria`) que lo
guarda en una tabla con RLS activo y sin políticas. Después,
`node kit/traer-solicitudes.mjs --bajar` lo escribe en la carpeta `entrada/` del
kit con el formato que este espera, y el informe se genera allí.

El circuito completo, la clave que hace falta y qué pasa si cambias las
preguntas están en [`kit/LEEME.md`](kit/LEEME.md).

## Pendiente antes de recibir una solicitud de verdad

- Completar el nombre fiscal, el NIF y el domicilio en `src/app/privacidad/page.tsx`
  (están como `[PENDIENTE]`; no se inventan).
- Decidir si se publica un teléfono: ahora mismo `site.telefono` es `null` a propósito.
- Enlazar los perfiles sociales reales en `site.redes`, que está vacío.
