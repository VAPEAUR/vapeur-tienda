-- Tabla de inscripción a novedades por correo (pie de página).
-- Ejecutar en Supabase → SQL Editor.
create table if not exists public.suscriptores (
  id bigint generated always as identity primary key,
  creado_en timestamptz not null default now(),
  correo text not null unique check (char_length(correo) <= 254 and correo like '%_@_%.__%')
);

alter table public.suscriptores enable row level security;

-- El proyecto no expone tablas nuevas solo: se dan permisos explícitos.
-- Solo se permite agregar (insert). Nadie puede leer la lista de correos
-- con la clave pública, para proteger los datos de los suscriptores.
grant insert on public.suscriptores to anon;

create policy "inscripcion publica" on public.suscriptores
  for insert to anon with check (true);
