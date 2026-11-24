-- ===== PEDIDOS PARA RECOGER EN SUCURSAL =====

-- 1) Menú en la base de datos: los precios los define el servidor
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  grupo text not null,
  seccion text not null,
  nombre text not null,
  descripcion text,
  variante text,
  precio numeric(10,2),
  unidad text,
  orden int not null default 0,
  activo boolean not null default true
);

alter table menu_items enable row level security;

drop policy if exists "Publico ve menu" on menu_items;
create policy "Publico ve menu" on menu_items for select to anon, authenticated
  using (activo);

drop policy if exists "Admin gestiona menu" on menu_items;
create policy "Admin gestiona menu" on menu_items for all to authenticated
  using (auth.email() = 'admin@puertoescondido.mx')
  with check (auth.email() = 'admin@puertoescondido.mx');

-- Carga inicial desde la carta actual (si vuelves a correr este archivo, borra antes: delete from menu_items;)
delete from menu_items;
insert into menu_items (grupo, seccion, nombre, descripcion, variante, precio, unidad, orden) values
('Mariscos', 'Platillo por temporada', 'Platillo de temporada', NULL, NULL, NULL, NULL, 1),
('Mariscos', 'Cocteles', 'Cóctel de camarón', NULL, 'CH', 140, NULL, 2),
('Mariscos', 'Cocteles', 'Cóctel de camarón', NULL, 'M', 178, NULL, 2),
('Mariscos', 'Cocteles', 'Cóctel de camarón', NULL, 'G', 225, NULL, 2),
('Mariscos', 'Cocteles', 'Cóctel de pulpo y camarón', NULL, 'CH', 175, NULL, 3),
('Mariscos', 'Cocteles', 'Cóctel de pulpo y camarón', NULL, 'M', 205, NULL, 3),
('Mariscos', 'Cocteles', 'Cóctel de pulpo y camarón', NULL, 'G', 245, NULL, 3),
('Mariscos', 'Cocteles', 'Cóctel de pulpo', NULL, 'CH', 175, NULL, 4),
('Mariscos', 'Cocteles', 'Cóctel de pulpo', NULL, 'M', 220, NULL, 4),
('Mariscos', 'Cocteles', 'Cóctel de pulpo', NULL, 'G', 270, NULL, 4),
('Mariscos', 'Cocteles', 'Cóctel especial', NULL, 'CH', 185, NULL, 5),
('Mariscos', 'Cocteles', 'Cóctel especial', NULL, 'M', 220, NULL, 5),
('Mariscos', 'Cocteles', 'Cóctel especial', NULL, 'G', 245, NULL, 5),
('Mariscos', 'Cocteles', 'Caldo de cahuamanta especial', 'Pulpo, camarón y callo de almeja', NULL, 210, NULL, 6),
('Mariscos', 'Cocteles', 'Caldo de cahuamanta sencillo', 'Camarón, pulpo y callo de almeja', NULL, 160, NULL, 7),
('Mariscos', 'Cocteles', 'Sopa del Puerto', NULL, NULL, 248, NULL, 8),
('Mariscos', 'Ceviches', 'Ceviche de pescado molido', NULL, 'TOST', 43, NULL, 9),
('Mariscos', 'Ceviches', 'Ceviche de pescado molido', NULL, 'ORDEN', 195, NULL, 9),
('Mariscos', 'Ceviches', 'Ceviche de pescado en trozo', NULL, 'TOST', 52, NULL, 10),
('Mariscos', 'Ceviches', 'Ceviche de pescado en trozo', NULL, 'ORDEN', 215, NULL, 10),
('Mariscos', 'Ceviches', 'Ceviche de camarón', NULL, 'TOST', 72, NULL, 11),
('Mariscos', 'Ceviches', 'Ceviche de camarón', NULL, 'ORDEN', 235, NULL, 11),
('Mariscos', 'Ceviches', 'Ceviche de camarón seco', NULL, 'TOST', 80, NULL, 12),
('Mariscos', 'Ceviches', 'Ceviche de camarón seco', NULL, 'ORDEN', 250, NULL, 12),
('Mariscos', 'Ceviches', 'Ceviche de atún fresco', NULL, 'TOST', 82, NULL, 13),
('Mariscos', 'Ceviches', 'Ceviche de atún fresco', NULL, 'ORDEN', 260, NULL, 13),
('Mariscos', 'Ceviches', 'Ceviche especial', NULL, 'TOST', 85, NULL, 14),
('Mariscos', 'Ceviches', 'Ceviche especial', NULL, 'ORDEN', 260, NULL, 14),
('Mariscos', 'Ceviches', 'Estofado de marlín', 'Pulpo, camarón y callo de almeja', 'TOST', 43, NULL, 15),
('Mariscos', 'Ceviches', 'Estofado de marlín', 'Pulpo, camarón y callo de almeja', 'ORDEN', 190, NULL, 15),
('Mariscos', 'Ceviches', 'Ensalada de pulpo', NULL, 'TOST', 98, NULL, 16),
('Mariscos', 'Ceviches', 'Ensalada de pulpo', NULL, 'ORDEN', 325, NULL, 16),
('Mariscos', 'Ceviches', 'Aguachile verde, rojo o negro', NULL, 'TOST', 82, NULL, 17),
('Mariscos', 'Ceviches', 'Aguachile verde, rojo o negro', NULL, 'ORDEN', 242, NULL, 17),
('Mariscos', 'Ceviches', 'Tostada de jaiba', NULL, NULL, 90, NULL, 18),
('Mariscos', 'Pescado frito', 'Huachinango', NULL, NULL, 275, 'pza', 19),
('Mariscos', 'Pescado frito', 'Mojarra', NULL, NULL, 185, 'pza', 20),
('Mariscos', 'Pescado zarandeado', 'Curvina', NULL, NULL, 460, 'kg', 21),
('Mariscos', 'Pescado zarandeado', 'Huachinango', NULL, NULL, 460, 'kg', 22),
('Mariscos', 'Pescado zarandeado', 'Lonja de dorado (230 g)', NULL, NULL, 275, NULL, 23),
('Mariscos', 'Camarones y filete (dorado)', 'Diabla', NULL, 'CAM', 218, NULL, 24),
('Mariscos', 'Camarones y filete (dorado)', 'Diabla', NULL, 'FILETE', 205, NULL, 24),
('Mariscos', 'Camarones y filete (dorado)', 'Ajo y ajillo', NULL, 'CAM', 218, NULL, 25),
('Mariscos', 'Camarones y filete (dorado)', 'Ajo y ajillo', NULL, 'FILETE', 205, NULL, 25),
('Mariscos', 'Camarones y filete (dorado)', 'Empanizados', NULL, 'CAM', 218, NULL, 26),
('Mariscos', 'Camarones y filete (dorado)', 'Empanizados', NULL, 'FILETE', 205, NULL, 26),
('Mariscos', 'Camarones y filete (dorado)', 'Tamarindo', NULL, 'CAM', 218, NULL, 27),
('Mariscos', 'Camarones y filete (dorado)', 'Tamarindo', NULL, 'FILETE', 205, NULL, 27),
('Mariscos', 'Camarones y filete (dorado)', 'Zarandeado', NULL, 'CAM', 238, NULL, 28),
('Mariscos', 'Camarones y filete (dorado)', 'Zarandeado', NULL, 'FILETE', 205, NULL, 28),
('Mariscos', 'Camarones y filete (dorado)', 'Chipotle con tequila', NULL, 'CAM', 218, NULL, 29),
('Mariscos', 'Camarones y filete (dorado)', 'Chipotle con tequila', NULL, 'FILETE', 205, NULL, 29),
('Mariscos', 'Camarones y filete (dorado)', 'Rockefeller', NULL, 'CAM', 218, NULL, 30),
('Mariscos', 'Camarones y filete (dorado)', 'Rockefeller', NULL, 'FILETE', 205, NULL, 30),
('Mariscos', 'Camarones y filete (dorado)', 'A la plancha', NULL, 'CAM', 218, NULL, 31),
('Mariscos', 'Camarones y filete (dorado)', 'A la plancha', NULL, 'FILETE', 205, NULL, 31),
('Mariscos', 'Camarones y filete (dorado)', 'Al pastor', NULL, 'CAM', 218, NULL, 32),
('Mariscos', 'Camarones y filete (dorado)', 'Al pastor', NULL, 'FILETE', 205, NULL, 32),
('Mariscos', 'Camarones y filete (dorado)', 'Mostaza con miel', NULL, 'CAM', 218, NULL, 33),
('Mariscos', 'Camarones y filete (dorado)', 'Mostaza con miel', NULL, 'FILETE', 205, NULL, 33),
('Mariscos', 'Camarones y filete (dorado)', 'Cilantro con nuez', NULL, 'CAM', 218, NULL, 34),
('Mariscos', 'Camarones y filete (dorado)', 'Cilantro con nuez', NULL, 'FILETE', 205, NULL, 34),
('Mariscos', 'Camarones y filete (dorado)', 'Almendrados', NULL, 'CAM', 218, NULL, 35),
('Mariscos', 'Camarones y filete (dorado)', 'Almendrados', NULL, 'FILETE', 205, NULL, 35),
('Mariscos', 'Camarones y filete (dorado)', 'Salsa champiñón', NULL, 'CAM', 218, NULL, 36),
('Mariscos', 'Camarones y filete (dorado)', 'Salsa champiñón', NULL, 'FILETE', 205, NULL, 36),
('Camarones, pulpo y botanas', 'Pulpo', 'Zarandeado', NULL, NULL, 330, NULL, 37),
('Camarones, pulpo y botanas', 'Pulpo', 'Ajo y ajillo', NULL, NULL, 310, NULL, 38),
('Camarones, pulpo y botanas', 'Pulpo', 'Diabla', NULL, NULL, 310, NULL, 39),
('Camarones, pulpo y botanas', 'Pulpo', 'Pulpo tatemado', NULL, NULL, 310, NULL, 40),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Cecina de pez', NULL, 'CH', 235, NULL, 41),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Cecina de pez', NULL, 'G', 275, NULL, 41),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Chicharrón de pescado', NULL, 'CH', 235, NULL, 42),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Chicharrón de pescado', NULL, 'G', 275, NULL, 42),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Botana mixta del Puerto', NULL, 'CH', 290, NULL, 43),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Botana mixta del Puerto', NULL, 'G', 360, NULL, 43),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Camarón para pelar', NULL, NULL, 235, NULL, 44),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Callo de hacha', NULL, NULL, NULL, NULL, 45),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Molcajete de mariscos', 'Frío o caliente', NULL, 285, NULL, 46),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Sashimi de atún o salmón', NULL, NULL, 280, NULL, 47),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Chicharrón de atún chica', NULL, 'CH', 250, NULL, 48),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Chicharrón de atún chica', NULL, 'G', 305, NULL, 48),
('Camarones, pulpo y botanas', 'Botanas del Puerto', 'Chicharrón de pulpo', NULL, NULL, 280, NULL, 49),
('Camarones, pulpo y botanas', 'Especialidades', 'Alambre de camarón', NULL, NULL, 225, NULL, 50),
('Camarones, pulpo y botanas', 'Especialidades', 'Piña rellena de mariscos', NULL, NULL, 275, NULL, 51),
('Camarones, pulpo y botanas', 'Especialidades', 'Salmón relleno', NULL, NULL, 298, NULL, 52),
('Camarones, pulpo y botanas', 'Especialidades', 'Filete relleno', NULL, NULL, 265, NULL, 53),
('Camarones, pulpo y botanas', 'Especialidades', 'Langosta al gusto', NULL, NULL, NULL, NULL, 54),
('Camarones, pulpo y botanas', 'Especialidades', 'Camarón al coco relleno de queso', NULL, NULL, 245, NULL, 55),
('Camarones, pulpo y botanas', 'Especialidades', 'Fetuccini de camarón', NULL, NULL, 240, NULL, 56),
('Camarones, pulpo y botanas', 'Especialidades', 'Fetuccini de pulpo', NULL, NULL, 275, NULL, 57),
('Camarones, pulpo y botanas', 'Especialidades', 'Medallón de atún al gusto', NULL, NULL, 265, NULL, 58),
('Camarones, pulpo y botanas', 'Especialidades', 'Combinado a la talla', NULL, NULL, 320, NULL, 59),
('Camarones, pulpo y botanas', 'Especialidades', 'Langostino al gusto', NULL, NULL, NULL, NULL, 60),
('Camarones, pulpo y botanas', 'Especialidades', 'Camarones momia', NULL, NULL, 245, NULL, 61),
('Camarones, pulpo y botanas', 'Especialidades', 'Jaibas rellenas', NULL, NULL, 242, NULL, 62),
('Camarones, pulpo y botanas', 'Especialidades', 'Pez espada al gusto (250 g)', NULL, NULL, 280, NULL, 63),
('Camarones, pulpo y botanas', 'Especialidades', 'Filete escondido', NULL, NULL, 280, NULL, 64),
('Especialidades, infantil y tacos', 'Infantil', 'Palomitas de camarón', NULL, NULL, 140, NULL, 65),
('Especialidades, infantil y tacos', 'Infantil', 'Hamburguesa (pescado o camarón)', NULL, NULL, 145, NULL, 66),
('Especialidades, infantil y tacos', 'Infantil', 'Filete junior', 'Empanizado o a la plancha', NULL, 145, NULL, 67),
('Especialidades, infantil y tacos', 'Infantil', 'Camarón junior', 'Empanizado o a la plancha', NULL, 145, NULL, 68),
('Especialidades, infantil y tacos', 'En su concha', 'Ostiones concha', NULL, NULL, 180, NULL, 69),
('Especialidades, infantil y tacos', 'En su concha', 'Ostiones zarandeados', NULL, NULL, 210, NULL, 70),
('Especialidades, infantil y tacos', 'En su concha', 'Ostiones Rockefeller', NULL, NULL, 260, NULL, 71),
('Especialidades, infantil y tacos', 'En su concha', 'Almeja reina', NULL, NULL, 125, 'pza', 72),
('Especialidades, infantil y tacos', 'Tacos', 'Gobernador (camarón con queso)', NULL, NULL, 82, NULL, 73),
('Especialidades, infantil y tacos', 'Tacos', 'Marlín (marlín y queso)', NULL, NULL, 55, NULL, 74),
('Especialidades, infantil y tacos', 'Tacos', 'Burrito marinero (camarón o marlín)', NULL, NULL, 158, NULL, 75),
('Especialidades, infantil y tacos', 'Carnes y aves', 'Fajita de res o pollo', NULL, NULL, 190, NULL, 76),
('Especialidades, infantil y tacos', 'Carnes y aves', 'Milanesa de pollo', NULL, NULL, 185, NULL, 77),
('Especialidades, infantil y tacos', 'Carnes y aves', 'Arrachera zarandeada (240 g)', NULL, NULL, 225, NULL, 78),
('Especialidades, infantil y tacos', 'Carnes y aves', 'Rib eye', NULL, NULL, 298, NULL, 79),
('Especialidades, infantil y tacos', 'Carnes y aves', 'Picaña', NULL, NULL, 278, NULL, 80),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Orden arroz', NULL, NULL, 50, NULL, 81),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Orden papa francesa', NULL, NULL, 70, NULL, 82),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Orden aguacate', NULL, NULL, 50, NULL, 83),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Orden guacamole', NULL, NULL, 75, NULL, 84),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Orden queso', NULL, NULL, 40, NULL, 85),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Orden ensalada dulce', NULL, NULL, 50, NULL, 86),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Consomé', NULL, NULL, 55, NULL, 87),
('Especialidades, infantil y tacos', 'Guarniciones extras', 'Queso extra', NULL, NULL, 45, NULL, 88),
('Especialidades, infantil y tacos', 'Preparados', 'Michelada', NULL, NULL, 95, NULL, 89),
('Especialidades, infantil y tacos', 'Preparados', 'Clamato', NULL, NULL, 60, NULL, 90),
('Especialidades, infantil y tacos', 'Preparados', 'Pirata', NULL, NULL, 95, NULL, 91),
('Especialidades, infantil y tacos', 'Preparados', 'Bull', NULL, NULL, 120, NULL, 92),
('Especialidades, infantil y tacos', 'Preparados', 'Calimocho', NULL, NULL, 90, NULL, 93),
('Especialidades, infantil y tacos', 'Preparados', 'Frutos rojos', NULL, NULL, 85, NULL, 94),
('Bebidas y postres', 'Bebidas', 'Naranjada', NULL, NULL, 55, NULL, 95),
('Bebidas y postres', 'Bebidas', 'Limonada', NULL, NULL, 55, NULL, 96),
('Bebidas y postres', 'Bebidas', 'Agua fresca del día', NULL, NULL, 45, NULL, 97),
('Bebidas y postres', 'Bebidas', 'Agua embotellada', NULL, NULL, 40, NULL, 98),
('Bebidas y postres', 'Bebidas', 'Refresco', NULL, NULL, 40, NULL, 99),
('Bebidas y postres', 'Bebidas', 'Agua de coco', NULL, NULL, 70, NULL, 100),
('Bebidas y postres', 'Bebidas', 'Bebidas preparadas', 'Maracuyá, fresa, kiwi, pepino, hierbabuena, guanábana', NULL, 60, NULL, 101),
('Bebidas y postres', 'Cerveza', 'Corona clara, oscura y light', NULL, NULL, 48, NULL, 102),
('Bebidas y postres', 'Cerveza', 'Pacífico', NULL, NULL, 48, NULL, 103),
('Bebidas y postres', 'Cerveza', 'Victoria', NULL, NULL, 48, NULL, 104),
('Bebidas y postres', 'Cerveza', 'Modelo negra o especial', NULL, NULL, 55, NULL, 105),
('Bebidas y postres', 'Cerveza', 'Ultra', NULL, NULL, 48, NULL, 106),
('Bebidas y postres', 'Cerveza', 'Caguama Corona', NULL, NULL, 108, NULL, 107),
('Bebidas y postres', 'Cerveza artesanal', 'Colimita', NULL, NULL, 85, NULL, 108),
('Bebidas y postres', 'Cerveza artesanal', 'Piedra Lisa', NULL, NULL, 85, NULL, 109),
('Bebidas y postres', 'Cerveza artesanal', 'Cayaco', NULL, NULL, 65, NULL, 110),
('Bebidas y postres', 'Postres y café', 'Plátanos flameados', NULL, NULL, 88, NULL, 111),
('Bebidas y postres', 'Postres y café', 'Pastel del día', NULL, NULL, 95, NULL, 112),
('Bebidas y postres', 'Postres y café', 'Café capuchino', NULL, NULL, 52, NULL, 113),
('Bebidas y postres', 'Postres y café', 'Café expreso o americano', NULL, NULL, 45, NULL, 114),
('Bebidas y postres', 'Postres y café', 'Carajillo', NULL, NULL, 110, NULL, 115),
('Bebidas y postres', 'Postres y café', 'Canija', NULL, NULL, 100, NULL, 116),
('Bebidas y postres', 'Postres y café', 'Frappuccino', NULL, NULL, 95, NULL, 117),
('Bebidas y postres', 'Postres y café', 'Capuchino con licor', NULL, NULL, 122, NULL, 118),
('Bebidas y postres', 'Postres y café', 'Helado de vainilla/chocolate', NULL, NULL, 80, NULL, 119),
('Bebidas y postres', 'Postres y café', 'Pan de elote', NULL, NULL, 95, NULL, 120);

-- 2) Columnas nuevas en pedidos
alter table pedidos add column if not exists notas text;
alter table pedidos add column if not exists metodo_pago varchar not null default 'sucursal';

-- Ya no se insertan pedidos directo desde el navegador: solo mediante la función
drop policy if exists "Publico crea pedidos" on pedidos;

-- 3) Crear pedido: calcula el total con los precios de la base, nunca con los del navegador
create or replace function public.crear_pedido(
  p_telefono varchar, p_nombre varchar, p_items jsonb, p_notas text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cliente uuid;
  v_folio varchar;
  v_total numeric := 0;
  v_detalle jsonb := '[]'::jsonb;
  it jsonb;
  m record;
  v_qty int;
begin
  if p_telefono !~ '^[0-9]{10}$' then raise exception 'Teléfono inválido'; end if;
  if p_nombre is null or length(trim(p_nombre)) < 2 or length(p_nombre) > 100 then
    raise exception 'Nombre inválido';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 40 then
    raise exception 'Pedido inválido';
  end if;
  if length(coalesce(p_notas, '')) > 300 then raise exception 'Notas demasiado largas'; end if;

  -- Límite: máximo 5 pedidos por teléfono en 24 horas
  if (select count(*) from pedidos p
        join clientes c on c.id = p.cliente_id
        where c.telefono = p_telefono
          and p.creado_en > now() - interval '24 hours') >= 5 then
    raise exception 'Este teléfono ya tiene varios pedidos recientes. Llámanos al +52 33 3162 2257.';
  end if;

  for it in select * from jsonb_array_elements(p_items) loop
    v_qty := (it->>'cantidad')::int;
    if v_qty is null or v_qty < 1 or v_qty > 20 then raise exception 'Cantidad inválida'; end if;

    select * into m from menu_items where id = (it->>'id')::uuid and activo;
    if not found or m.precio is null then
      raise exception 'Un platillo ya no está disponible. Revisa tu pedido.';
    end if;

    v_total := v_total + m.precio * v_qty;
    v_detalle := v_detalle || jsonb_build_object(
      'nombre', m.nombre, 'variante', m.variante, 'unidad', m.unidad,
      'precio', m.precio, 'cantidad', v_qty, 'subtotal', m.precio * v_qty);
  end loop;

  insert into clientes (telefono, nombre, total_visitas, ultima_visita)
  values (p_telefono, trim(p_nombre), 0, now())
  on conflict (telefono) do update set ultima_visita = now()
  returning id into v_cliente;

  -- Folio único PD-XXXX
  loop
    v_folio := 'PD-' || lpad(floor(random() * 10000)::text, 4, '0');
    exit when not exists (select 1 from pedidos where folio = v_folio);
  end loop;

  insert into pedidos (folio, cliente_id, detalle, total, tipo_entrega, estado, metodo_pago, notas)
  values (v_folio, v_cliente, v_detalle, v_total, 'recoger', 'nuevo', 'sucursal', p_notas);

  return json_build_object('folio', v_folio, 'total', v_total);
end;
$$;

-- 4) Lectura del menú para el sitio: solo platillos activos
-- (ya cubierta por la política "Publico ve menu")
