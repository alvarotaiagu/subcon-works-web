# Del formulario de la web al kit de auditoría

La sección «Auditoría gratuita» de la web recoge el cuestionario **«Cómo
trabajáis por dentro»** — las mismas 36 preguntas, con la misma numeración
P1–P36, que el kit `KITS Claude/03-kit-auditoria-negocio`.

Esta carpeta tiene el puente entre las dos cosas.

## El circuito completo

```
 el negocio rellena            Edge Function              tú, cuando quieras
 /auditoria/ en la web  ──POST──▶  solicitar-auditoria  ──▶  tabla de Supabase
                                                                    │
                                              node kit/traer-solicitudes.mjs --bajar
                                                                    ▼
                                    KITS Claude/03-kit-auditoria-negocio/entrada/
                                                                    │
                                                    «audita este formulario»
                                                                    ▼
                                                       informe en workspace/
```

La web no habla con el kit en ningún momento: deja la solicitud en una tabla y
tú te la bajas cuando te pones. Así el kit sigue funcionando exactamente igual
si el formulario llega por email, por WhatsApp o desde aquí.

## Cómo se usa

```bash
# ver qué hay pendiente
node kit/traer-solicitudes.mjs

# escribirlo en la carpeta entrada/ del kit
node kit/traer-solicitudes.mjs --bajar

# ...y dejarlas marcadas como "en curso" para que no vuelvan a salir
node kit/traer-solicitudes.mjs --bajar --marcar
```

Otras opciones: `--todas` incluye también las ya marcadas, y
`--destino "ruta/a/entrada"` escribe en otro sitio (por defecto va a
`../../KITS Claude/03-kit-auditoria-negocio/entrada`).

## La clave

El script lee la tabla con la clave de servicio del proyecto, que **nunca se
commitea**. Ponla en un `.env.local` en la raíz del repo (ya está en
`.gitignore`):

```
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Se copia de Supabase → *Project Settings* → *API Keys* → `service_role`.

Sin esa clave no se puede leer nada: la tabla tiene RLS activo y **ninguna
política**, así que la clave publicable que va en el navegador no sirve ni para
leer ni para escribir. Lo único que puede escribir es la Edge Function, que usa
la de servicio desde el servidor.

## Lo que se escribe en `entrada/`

Un `.md` por solicitud, llamado `<fecha>-<negocio>.md`, con:

- una **ficha de contacto** arriba (negocio, sector, ciudad, web, contacto);
- los **siete bloques** con sus preguntas numeradas P1–P36 y la respuesta
  debajo de cada una, tal cual la escribieron;
- las que quedaron vacías marcadas como `_(sin contestar)_`;
- un apartado final de **huecos** con la lista de las que faltan, para que el
  informe las marque como «sin datos» en vez de inventárselas.

Es el mismo formato del ejemplo del kit
(`ejemplos/negocio-de-practica/formulario-relleno.md`), así que la skill
`auditoria-negocio` lo lee sin que haya que tocarle nada.

## Qué pasa si cambias las preguntas

La numeración manda. El informe cita las respuestas por su número, así que si
quitas una pregunta **deja los números que queden** y no renumeres. Hay que
tocar los dos sitios a la vez:

- `src/content/auditoria.ts` — lo que ve quien rellena;
- `kit/traer-solicitudes.mjs` (la constante `BLOQUES`) — lo que se escribe en
  `entrada/`.

La Edge Function acepta cualquier clave entre `P1` y `P36` y descarta el resto,
así que no hace falta desplegarla de nuevo salvo que pases de 36 preguntas.

## Infraestructura

| Qué | Dónde |
|---|---|
| Proyecto Supabase | `subcon-works` (`gotsjhofrcdnyxdwowel`), región eu-west-3 (París) |
| Tabla | `public.solicitudes_auditoria` — RLS activo, sin políticas |
| Edge Function | `solicitar-auditoria`, `verify_jwt: false` |
| Protección | origen permitido, campo trampa, validación de forma, 3 envíos por correo cada 10 min y 40 por hora en total |
| Estados | `nueva` → `en_curso` → `entregada` (o `descartada`) |
