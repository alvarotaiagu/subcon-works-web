-- Límite de ritmo de la Edge Function suscribir-recursos.
--
-- Solo guarda el SHA-256 del correo, nunca el correo: la lista de verdad vive
-- en Brevo. La función borra las filas de más de 24 h en cada llamada.
-- RLS activo y sin políticas, como solicitudes_auditoria: solo escribe y lee la
-- función, con la clave de servicio.
create table if not exists public.intentos_recursos (
  huella text not null,
  creado_en timestamptz not null default now()
);

create index if not exists intentos_recursos_huella_idx on public.intentos_recursos (huella);
create index if not exists intentos_recursos_creado_en_idx on public.intentos_recursos (creado_en);

alter table public.intentos_recursos enable row level security;
