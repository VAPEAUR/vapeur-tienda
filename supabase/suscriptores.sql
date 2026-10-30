-- Inscripción a avisos por correo (formulario "Inscribirme" del pie).
-- Ejecutar una vez en Supabase → SQL Editor (después de cuentas.sql).
--
-- Solo se guarda: correo, fecha, el consentimiento y la declaración de
-- mayoría de edad (con la versión del texto aceptado) y una clave al azar para
-- darse de baja con un clic. Nunca RUT, fecha de nacimiento ni nombre.
--
-- Solo el servidor (secret key) escribe y lee. El navegador no tiene ningún
-- permiso sobre esta tabla: la lista de correos no se puede leer desde afuera.
--
-- Ley 21.642: lo que se envíe a esta lista no puede ser promoción ni
-- publicidad de productos de nicotina. Antes de enviar el primer correo, el
-- abogado debe confirmar el alcance de los avisos (y se recomienda pedir
-- confirmación del correo, doble opt-in).

create table if not exists public.suscriptores (
  id bigint generated always as identity primary key,
  creado_en timestamptz not null default now(),
  correo text not null unique check (char_length(correo) <= 254 and correo like '%_@_%.__%'),
  acepta_avisos boolean not null check (acepta_avisos),
  declara_18 boolean not null check (declara_18),
  texto_version text not null,
  token_baja uuid not null unique default gen_random_uuid()
);

alter table public.suscriptores enable row level security;

-- Sin políticas: con RLS activo y sin políticas, anon y authenticated no
-- pueden leer, insertar, cambiar ni borrar. La secret key pasa por encima.
drop policy if exists "inscripcion publica" on public.suscriptores;
revoke all on public.suscriptores from anon, authenticated;
grant select, insert, update, delete on public.suscriptores to service_role;
