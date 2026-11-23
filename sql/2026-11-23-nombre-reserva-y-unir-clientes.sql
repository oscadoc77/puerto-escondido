-- 1) Nombre por reservación (el nombre que se escribió en ESA reservación)
alter table reservaciones add column if not exists nombre_reserva varchar;

update reservaciones r
set nombre_reserva = c.nombre
from clientes c
where c.id = r.cliente_id and r.nombre_reserva is null;

-- 2) registrar_reservacion: guarda el nombre de cada reservación
create or replace function public.registrar_reservacion(
  p_telefono varchar, p_nombre varchar, p_fecha date, p_hora time,
  p_personas int, p_notas text, p_folio varchar)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_telefono !~ '^[0-9]{10}$' then raise exception 'Teléfono inválido'; end if;
  if p_nombre is null or length(trim(p_nombre)) < 2 or length(p_nombre) > 100 then
    raise exception 'Nombre inválido';
  end if;
  if p_personas is null or p_personas < 1 or p_personas > 20 then
    raise exception 'Número de personas inválido';
  end if;
  if p_fecha < (now() at time zone 'America/Mexico_City')::date then
    raise exception 'La fecha ya pasó';
  end if;
  if length(coalesce(p_notas, '')) > 500 then raise exception 'Notas demasiado largas'; end if;

  -- Límite por teléfono: máximo 3 reservaciones en 24 horas
  if (select count(*) from reservaciones r
        join clientes c on c.id = r.cliente_id
        where c.telefono = p_telefono
          and r.creado_en > now() - interval '24 hours') >= 3 then
    raise exception 'Este teléfono ya tiene varias reservaciones recientes. Llámanos al +52 33 3162 2257.';
  end if;

  -- Límite global: máximo 100 reservaciones por hora en todo el sitio
  if (select count(*) from reservaciones
        where creado_en > now() - interval '1 hour') >= 100 then
    raise exception 'Demasiadas solicitudes en este momento. Intenta de nuevo más tarde.';
  end if;

  insert into clientes (telefono, nombre, total_visitas, ultima_visita)
  values (p_telefono, trim(p_nombre), 0, now())
  on conflict (telefono) do update set ultima_visita = now();

  insert into reservaciones (folio, cliente_id, fecha, hora, personas, notas_reserva, nombre_reserva)
  values (p_folio, (select id from clientes where telefono = p_telefono),
          p_fecha, p_hora, p_personas, p_notas, trim(p_nombre));

  return json_build_object('folio', p_folio);
end;
$$;

-- 3) Unir dos fichas de cliente (solo admin): mueve reservaciones, suma visitas y borra la ficha sobrante
create or replace function public.unir_clientes(p_origen uuid, p_destino uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.email() is distinct from 'admin@puertoescondido.mx' then
    raise exception 'No autorizado';
  end if;
  if p_origen = p_destino then
    raise exception 'Son la misma ficha';
  end if;

  update reservaciones set cliente_id = p_destino where cliente_id = p_origen;

  update clientes d
  set total_visitas = d.total_visitas + o.total_visitas,
      ultima_visita = greatest(d.ultima_visita, o.ultima_visita),
      notas_permanentes = nullif(concat_ws(' | ', d.notas_permanentes, o.notas_permanentes), '')
  from clientes o
  where o.id = p_origen and d.id = p_destino;

  delete from clientes where id = p_origen;
end;
$$;
