-- Ajuste legal 28-oct-2026: el sello del XROS 4 decía "repuestos siempre en
-- stock" y "Si estás partiendo" (promesa difícil de probar, Ley 19.496, y
-- mensaje que apunta a quien recién empieza, Ley 21.642). Correr una vez en
-- Supabase > SQL Editor.
update public.productos
set elegido = 'Si buscas un pod simple: carga rápida y cartucho fácil de cambiar.'
where slug = 'xros-4-kit-pod';
