-- Permisos y políticas para que el panel (admin) vea y cambie el estado de los pedidos.
-- Se puede correr varias veces sin problema.

alter table pedidos enable row level security;

grant select, update on pedidos to authenticated;

drop policy if exists "Admin ve pedidos" on pedidos;
create policy "Admin ve pedidos" on pedidos for select to authenticated
  using (auth.email() = 'admin@puertoescondido.mx');

drop policy if exists "Admin actualiza pedidos" on pedidos;
create policy "Admin actualiza pedidos" on pedidos for update to authenticated
  using (auth.email() = 'admin@puertoescondido.mx')
  with check (auth.email() = 'admin@puertoescondido.mx');
