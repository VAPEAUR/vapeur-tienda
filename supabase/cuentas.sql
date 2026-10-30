-- Cuentas de cliente (30-oct-2026).
-- Pegar completo en Supabase → SQL Editor → Run, DESPUÉS de pedidos.sql.
-- Se puede correr más de una vez.
--
-- El cliente entra con un código que le llega al correo (Supabase
-- Auth, sin contraseña). Cada cuenta tiene a lo más un perfil con sus datos de
-- despacho para llenar el checkout.
--
-- Quién toca esta tabla:
--   · Cada cliente (rol authenticated) lee, crea, cambia y borra SOLO su fila.
--   · La clave pública (anon) no ve nada.
--   · Los pedidos del cliente NO se leen con RLS: los entrega el servidor
--     (/api/cuenta) después de comprobar que el correo de la cuenta está
--     confirmado, y solo con columnas seguras.
--
-- Datos mínimos (Ley 19.628 / 21.719): NO se guardan RUT, fecha de nacimiento
-- ni datos de tarjeta. La edad se verifica en cada compra (Ley 21.642).

create table if not exists public.perfiles (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  nombre text check (char_length(nombre) <= 120),
  telefono text check (char_length(telefono) <= 20),
  region text check (char_length(region) <= 80),
  comuna text check (char_length(comuna) <= 80),
  direccion text check (char_length(direccion) <= 160),
  depto text check (char_length(depto) <= 80),

  -- Al crear la cuenta: declaró tener 18 años o más y aceptó Términos y Privacidad.
  mayor_de_edad boolean not null check (mayor_de_edad),
  acepto_terminos_en timestamptz not null,

  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

drop trigger if exists perfiles_actualizado on public.perfiles;
create trigger perfiles_actualizado before update on public.perfiles
  for each row execute function public.marcar_actualizado();

drop policy if exists "cliente ve su perfil" on public.perfiles;
create policy "cliente ve su perfil" on public.perfiles
  for select to authenticated using (usuario_id = (select auth.uid()));

drop policy if exists "cliente crea su perfil" on public.perfiles;
create policy "cliente crea su perfil" on public.perfiles
  for insert to authenticated with check (usuario_id = (select auth.uid()));

drop policy if exists "cliente cambia su perfil" on public.perfiles;
create policy "cliente cambia su perfil" on public.perfiles
  for update to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));

drop policy if exists "cliente borra su perfil" on public.perfiles;
create policy "cliente borra su perfil" on public.perfiles
  for delete to authenticated using (usuario_id = (select auth.uid()));

revoke all on public.perfiles from anon, authenticated;
grant select, insert, update, delete on public.perfiles to authenticated;
grant select on public.perfiles to service_role;

-- Para listar rápido los pedidos de una cuenta (el correo se guarda en minúsculas).
create index if not exists pedidos_correo_creado on public.pedidos (correo, creado_en desc);

-- El servidor revisa que una cuenta del panel /admin no se borre desde la tienda.
grant select on public.administradores to service_role;
