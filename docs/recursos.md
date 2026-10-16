# Lista de recursos por correo

La sección «Recursos» de la portada pide el correo a cambio de skills de Claude,
plantillas y checklists. Es el sitio donde se juntan correos para email
marketing, con consentimiento propio y doble confirmación.

**Estado (2026-10-11): construida y apagada.** Se enciende cuando el estudio
tenga dominio propio. Brevo con un remitente `@gmail.com` acaba en spam o
rechazado (desde 2024 Gmail y Yahoo exigen un dominio autenticado para envíos
masivos).

## Cómo va

```
portada (#recursos) ──POST──▶ suscribir-recursos ──▶ Brevo: correo de confirmación
                                    │                       │ clic
                                    ▼                       ▼
                         intentos_recursos           lista «Recursos»
                         (SHA-256, 24 h,             y vuelta a /?suscrito=1#recursos
                          solo límite de ritmo)
```

- `src/components/sections/Recursos.tsx`: la sección. Solo se monta con
  `NEXT_PUBLIC_RECURSOS_ENDPOINT` (ver `src/lib/recursos.ts`). Sin la variable,
  el build de Pages sale idéntico al de antes.
- `supabase/functions/suscribir-recursos/`: valida, limita (2 por correo y día,
  60 por hora en total) y pide a Brevo la doble confirmación.
- `supabase/migrations/20261011120000_intentos_recursos.sql`: la tabla del
  límite de ritmo. Solo huellas, nunca el correo.
- `/privacidad`: con la variable aparece el apartado «La lista de recursos por
  correo», marcado `[REVISAR]` hasta que se apruebe el texto.

**Los correos del formulario de auditoría no van a esta lista.** Se recogieron
prometiendo que no habría boletín ni publicidad (está escrito en
`/privacidad`). Solo entran los que se apuntan aquí.

## Encenderla

1. **Dominio.** Comprar el dominio del estudio y verificarlo en Brevo
   (*Senders, Domains & Dedicated IPs → Domains*: DKIM, SPF y DMARC en el DNS).
   Crear el remitente `hola@<dominio>` o similar.
2. **Brevo.**
   - Lista nueva «Recursos» y apuntar su id.
   - Plantilla de doble confirmación: *Campaigns → Templates → New template*,
     marcada como «Double opt-in (DOI)». El botón tiene que enlazar a
     `{{ params.DOIurl }}`. Texto propuesto:
     > **Asunto:** Confirma tu correo para recibir los recursos
     >
     > Alguien (esperamos que tú) ha apuntado este correo en subcon.works para
     > recibir skills, plantillas y checklists. Pulsa el botón para confirmarlo.
     > Si no has sido tú, ignora este correo y no volverás a saber de nosotros.
     >
     > [Confirmar mi correo]
   - Clave de API: *SMTP & API → API Keys*.
3. **Supabase** (proyecto `subcon-works`, `gotsjhofrcdnyxdwowel`):
   - Aplicar la migración.
   - Secretos de la función: `BREVO_API_KEY`, `BREVO_LISTA_ID`,
     `BREVO_PLANTILLA_DOI_ID`.
   - Desplegar `suscribir-recursos` con `verify_jwt` desactivado (igual que
     `solicitar-auditoria`).
   - Si la web se muda al dominio nuevo, añadir el origen en `ORIGENES` de
     las dos funciones.
4. **Web.** Definir `NEXT_PUBLIC_RECURSOS_ENDPOINT` en el build (workflow de
   Pages) con la URL de la función, quitar `[REVISAR]` del apartado de
   privacidad cuando esté aprobado, y completar los `[PENDIENTE]` del
   responsable (nombre fiscal, NIF, domicilio). Sin ellos no se puede encender.
5. **Probar** con un correo propio: alta → correo de confirmación → clic →
   vuelta a la portada con «Ya estás dentro» → contacto en la lista.

## Al mandar correos

- Cada campaña lleva el enlace de baja de Brevo (lo pone él en el pie).
- Lo que se manda tiene que ser lo que promete la casilla: recursos y alguna
  novedad del estudio. Para otra cosa hay que pedir otro consentimiento.
