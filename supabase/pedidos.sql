-- Pedidos de la tienda y pago con Webpay Plus (30-oct-2026).
-- Pegar completo en Supabase → SQL Editor → Run, DESPUÉS de catalogo.sql.
-- Se puede correr más de una vez.
--
-- Quién toca esta tabla:
--   · El servidor de la tienda, con la secret key (rol service_role): crea el
--     pedido, guarda la respuesta de Webpay y descuenta stock.
--   · El panel /admin (administradores): solo puede LEER los pedidos.
--   · La clave pública (anon) NO puede leer ni escribir pedidos.
--
-- Datos mínimos (Ley 19.628 / 21.719): NO se guardan el RUT ni la fecha de
-- nacimiento. Se validan en el servidor para cumplir la Ley 21.642 (solo
-- mayores de 18) y queda registrado solo que la verificación se hizo.
-- Nunca se guardan datos de tarjeta: Webpay entrega solo los 4 últimos dígitos.

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero bigint generated always as identity (start with 100001) unique,
  -- Clave al azar para ver la página de confirmación sin iniciar sesión.
  clave_acceso text not null default replace(gen_random_uuid()::text, '-', ''),
  estado text not null default 'pendiente_pago'
    check (estado in ('pendiente_pago', 'pagado', 'rechazado', 'anulado', 'enviado', 'entregado', 'devuelto')),

  -- Cliente y despacho
  correo text not null check (char_length(correo) <= 254),
  nombre text not null check (char_length(nombre) between 3 and 120),
  telefono text not null check (char_length(telefono) <= 20),
  region text not null,
  comuna text not null,
  direccion text not null check (char_length(direccion) <= 160),
  depto text check (char_length(depto) <= 80),

  -- Ley 21.642: evidencia de que se verificó la edad (sin guardar el dato).
  edad_verificada boolean not null check (edad_verificada),
  acepto_terminos_en timestamptz not null,

  -- Montos en CLP con IVA, calculados en el servidor. items: [{slug, nombre, variante, precio, cantidad}]
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  subtotal integer not null check (subtotal > 0),
  despacho integer not null check (despacho >= 0),
  total integer not null check (total = subtotal + despacho),

  -- Webpay Plus
  webpay_ambiente text not null default 'integracion' check (webpay_ambiente in ('integracion', 'produccion')),
  webpay_orden text unique,
  webpay_token text unique,
  webpay_respuesta jsonb,
  pagado_en timestamptz,
  correo_enviado_en timestamptz,

  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists pedidos_estado_creado on public.pedidos (estado, creado_en desc);

alter table public.pedidos enable row level security;

drop trigger if exists pedidos_actualizado on public.pedidos;
create trigger pedidos_actualizado before update on public.pedidos
  for each row execute function public.marcar_actualizado();

-- El panel solo lee. El servidor usa service_role, que no pasa por RLS.
drop policy if exists "admin ve pedidos" on public.pedidos;
create policy "admin ve pedidos" on public.pedidos
  for select to authenticated using ((select public.es_admin()));

revoke all on public.pedidos from anon, authenticated;
grant select on public.pedidos to authenticated;
grant select, insert, update on public.pedidos to service_role;
grant select on public.productos to service_role;

-- Marca el pedido como pagado y descuenta stock en un solo paso. Si el pedido
-- ya no estaba pendiente (por ejemplo, el cliente recargó la página de
-- retorno) no hace nada y devuelve false: así el stock y el correo no se
-- duplican.
create or replace function public.confirmar_pago(p_pedido uuid, p_respuesta jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_items jsonb;
  v_item jsonb;
begin
  update public.pedidos
     set estado = 'pagado', pagado_en = now(), webpay_respuesta = p_respuesta
   where id = p_pedido and estado = 'pendiente_pago'
  returning items into v_items;

  if v_items is null then
    return false;
  end if;

  for v_item in select * from jsonb_array_elements(v_items) loop
    -- Nunca bajo cero: si dos personas compraron la última unidad a la vez,
    -- el pedido igual queda pagado y se resuelve a mano (stock en 0).
    update public.productos
       set stock = greatest(stock - (v_item ->> 'cantidad')::integer, 0)
     where slug = v_item ->> 'slug';
  end loop;

  return true;
end;
$$;

revoke execute on function public.confirmar_pago(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.confirmar_pago(uuid, jsonb) to service_role;
