-- Tabla TEMPORAL para la prueba técnica Cloudflare + Supabase (27/28-oct-2026).
-- Ejecutar en Supabase → SQL Editor. Borrar con: drop table prueba_conexion;
create table if not exists public.prueba_conexion (
  id bigint generated always as identity primary key,
  creado_en timestamptz not null default now(),
  origen text not null check (char_length(origen) <= 40)
);

alter table public.prueba_conexion enable row level security;

-- Solo para la prueba: la clave pública puede leer y agregar filas, nada más.
create policy "prueba lectura" on public.prueba_conexion
  for select to anon using (true);
create policy "prueba escritura" on public.prueba_conexion
  for insert to anon with check (origen = 'cloudflare-workers');
