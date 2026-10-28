-- Catálogo de la tienda y permisos del panel /admin (sprint 2, 27-oct-2026).
-- Pegar completo en Supabase → SQL Editor → Run. Se puede correr más de una vez.
-- El proyecto NO expone tablas nuevas solo: por eso los GRANT explícitos.

-- 1. Quién puede usar el panel
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);
alter table public.administradores enable row level security;

drop policy if exists "cada uno ve su fila" on public.administradores;
create policy "cada uno ve su fila" on public.administradores
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.administradores where user_id = (select auth.uid()));
$$;

-- 2. Productos
create table if not exists public.productos (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  categoria text not null check (categoria in ('equipos', 'repuestos', 'liquidos', 'desechables', 'accesorios')),
  marca text not null check (length(trim(marca)) > 0),
  nombre text not null check (length(trim(nombre)) > 0),
  dato text not null default '',
  precio integer not null check (precio >= 0),
  stock integer not null default 0 check (stock >= 0),
  arte text not null default 'estuche'
    check (arte in ('pod', 'pod2', 'mod', 'cartucho', 'coil', 'frasco', 'desechable', 'cable', 'estuche', 'bateria')),
  color text,
  variante_nombre text,
  variante_opciones text[],
  compatible text,
  equipo text references public.productos (slug) on update cascade on delete set null,
  elegido text,
  nicotina boolean not null default false,
  descripcion text not null default '',
  activo boolean not null default true,
  orden integer not null default 100,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
alter table public.productos enable row level security;

create or replace function public.marcar_actualizado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists productos_actualizado on public.productos;
create trigger productos_actualizado before update on public.productos
  for each row execute function public.marcar_actualizado();

-- La tienda ve solo los productos activos; el panel ve y cambia todo.
drop policy if exists "ver productos" on public.productos;
create policy "ver productos" on public.productos
  for select to anon, authenticated using (activo or (select public.es_admin()));

drop policy if exists "admin agrega" on public.productos;
create policy "admin agrega" on public.productos
  for insert to authenticated with check ((select public.es_admin()));

drop policy if exists "admin cambia" on public.productos;
create policy "admin cambia" on public.productos
  for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

drop policy if exists "admin borra" on public.productos;
create policy "admin borra" on public.productos
  for delete to authenticated using ((select public.es_admin()));

grant select on public.productos to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;
grant select on public.administradores to authenticated;
revoke execute on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated;

-- 3. Carga inicial: los 15 productos de ejemplo del prototipo (no pisa cambios).
insert into public.productos
  (slug, categoria, marca, nombre, dato, precio, stock, arte, color, variante_nombre, variante_opciones,
   compatible, equipo, elegido, nicotina, descripcion, orden)
values
  ('xros-4-kit-pod', 'equipos', 'Vaporesso', 'XROS 4 kit pod', '1.000 mAh · USB-C · cartucho 3 ml', 34990, 6, 'pod', null, 'Color', array['Negro', 'Plata', 'Azul acero'], 'Cartuchos XROS 0,6 Ω, 0,8 Ω y 1,2 Ω.', null, 'Si buscas un pod simple: carga rápida y cartucho fácil de cambiar.', false, 'Equipo pod compacto con batería de 1.000 mAh y carga USB-C. Usa cartuchos recargables de 3 ml que se cambian sin herramientas.', 10),
  ('caliburn-g3-kit-pod', 'equipos', 'Uwell', 'Caliburn G3 kit pod', '900 mAh · flujo de aire regulable', 32990, 4, 'pod2', null, 'Color', array['Grafito', 'Plata', 'Verde bosque'], 'Cartuchos Caliburn G3 0,6 Ω y 0,9 Ω.', null, 'Si ya usas pod y quieres regular el tiro.', false, 'Pod con flujo de aire regulable y batería de 900 mAh. Cartuchos de 2,5 ml con llenado lateral.', 20),
  ('aegis-legend-3-kit', 'equipos', 'Geekvape', 'Aegis Legend 3 kit', 'Hasta 200 W · 2 baterías 18650', 69990, 2, 'mod', null, 'Color', array['Negro', 'Plata'], 'Coils Geekvape serie Z. Baterías 18650 (se venden aparte).', null, 'Si quieres más autonomía y potencia regulable.', false, 'Kit de potencia regulable hasta 200 W, resistente a golpes y agua. Funciona con dos baterías 18650 que se compran aparte.', 30),
  ('cartucho-xros-06', 'repuestos', 'Vaporesso', 'Cartucho XROS 0,6 Ω (4 un.)', 'Sirve para XROS 3, 4 y Mini', 9990, 12, 'cartucho', null, null, null, null, 'xros-4-kit-pod', null, false, 'Pack de 4 cartuchos de 0,6 Ω para equipos XROS. Más vapor, ideal con freebase.', 40),
  ('cartucho-xros-08', 'repuestos', 'Vaporesso', 'Cartucho XROS 0,8 Ω (4 un.)', 'Sirve para XROS 3, 4 y Mini', 9990, 9, 'cartucho', null, null, null, null, 'xros-4-kit-pod', null, false, 'Pack de 4 cartuchos de 0,8 Ω para equipos XROS. Pensado para sales de nicotina.', 50),
  ('cartucho-caliburn-g3-09', 'repuestos', 'Uwell', 'Cartucho Caliburn G3 0,9 Ω (4 un.)', 'Sirve para Caliburn G3', 10990, 0, 'cartucho', null, null, null, null, 'caliburn-g3-kit-pod', null, false, 'Pack de 4 cartuchos de 0,9 Ω para Caliburn G3.', 60),
  ('coil-geekvape-z-04', 'repuestos', 'Geekvape', 'Coil serie Z 0,4 Ω (5 un.)', 'Sirve para Aegis Legend 3', 12990, 7, 'coil', null, null, null, null, 'aegis-legend-3-kit', null, false, 'Pack de 5 resistencias serie Z de 0,4 Ω.', 70),
  ('sales-tabaco-clasico-30', 'liquidos', 'Vapeur Selección', 'Sales de nicotina Tabaco Clásico 30 ml', 'Sales de nicotina · 50/50', 8990, 15, 'frasco', null, 'Nicotina', array['10 mg', '20 mg'], null, null, null, true, 'Líquido de sales de nicotina sabor tabaco. Frasco de 30 ml con tapa a prueba de niños.', 80),
  ('sales-mentol-30', 'liquidos', 'Vapeur Selección', 'Sales de nicotina Mentol 30 ml', 'Sales de nicotina · 50/50', 8990, 3, 'frasco', '#8FB5B0', 'Nicotina', array['10 mg', '20 mg'], null, null, null, true, 'Líquido de sales de nicotina sabor mentol. Frasco de 30 ml con tapa a prueba de niños.', 90),
  ('freebase-tabaco-rubio-60', 'liquidos', 'Vapeur Selección', 'Freebase Tabaco Rubio 60 ml', 'Freebase · 70/30 · 3 mg', 12990, 8, 'frasco', '#A8875A', null, null, null, null, null, true, 'Líquido freebase sabor tabaco rubio, 3 mg de nicotina. Frasco de 60 ml.', 100),
  ('desechable-600-tabaco', 'desechables', 'Elf Bar', 'Desechable 600 inh. Tabaco', '20 mg · listo para usar', 6990, 20, 'desechable', '#3A4247', null, null, null, null, null, true, 'Equipo desechable de unas 600 inhalaciones, sabor tabaco, 20 mg de nicotina.', 110),
  ('desechable-600-mentol', 'desechables', 'Elf Bar', 'Desechable 600 inh. Mentol', '20 mg · listo para usar', 6990, 14, 'desechable', '#4B6662', null, null, null, null, null, true, 'Equipo desechable de unas 600 inhalaciones, sabor mentol, 20 mg de nicotina.', 120),
  ('cable-usb-c-1m', 'accesorios', 'Vapeur', 'Cable USB-C 1 m', 'Carga rápida 3 A', 3990, 30, 'cable', null, null, null, null, null, null, false, 'Cable USB-C de 1 metro para cargar tu equipo.', 130),
  ('estuche-rigido-pod', 'accesorios', 'Vapeur', 'Estuche rígido para pod', 'Cierre con cremallera', 5990, 10, 'estuche', null, null, null, null, null, null, false, 'Estuche rígido para guardar tu pod y un cartucho de repuesto.', 140),
  ('bateria-18650-3000', 'accesorios', 'Samsung', 'Batería 18650 3.000 mAh (2 un.)', 'Para kits con batería externa', 14990, 5, 'bateria', null, null, null, null, null, null, false, 'Par de baterías 18650 de 3.000 mAh para equipos con batería externa.', 150)
on conflict (slug) do nothing;

-- 4. Después de crear tu usuario en Authentication → Users → Add user,
--    cambia el correo y corre solo esta línea:
-- insert into public.administradores (user_id) select id from auth.users where email = 'TU_CORREO@ejemplo.cl';
