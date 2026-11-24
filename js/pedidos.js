// ===== PEDIDOS PARA RECOGER EN SUCURSAL =====
// Página pedidos.html. El total lo calcula el servidor (función crear_pedido).
const SUPABASE_URL = 'https://qrtngsebgxfgtkzudfey.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uYNvIEgQk1mpEMMBJkCB8w_d3BlPuuC';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let catalogo = [];   // platillos activos desde menu_items
let carrito = {};    // id -> { id, nombre, variante, unidad, precio, cantidad }

function escHtml(v) {
  return String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmtPesos(n) {
  return '$' + Number(n).toLocaleString('es-MX', { maximumFractionDigits: 0 });
}

function filaPedido(it) {
  const etiqueta = it.variante ? `${it.nombre} · ${it.variante}` : it.nombre;
  const desc = it.descripcion ? `<div class="ped-desc">${escHtml(it.descripcion)}</div>` : '';
  if (it.precio == null) {
    return `<div class="ped-item"><div><div class="ped-nombre">${escHtml(etiqueta)}</div>${desc}</div>
      <div class="ped-der"><span class="ped-consultar">Consultar en sucursal</span></div></div>`;
  }
  const cant = carrito[it.id] ? carrito[it.id].cantidad : 0;
  const unidad = it.unidad ? ` /${escHtml(it.unidad)}` : '';
  return `<div class="ped-item">
      <div><div class="ped-nombre">${escHtml(etiqueta)}</div>${desc}</div>
      <div class="ped-der">
        <span class="ped-precio">${fmtPesos(it.precio)}${unidad}</span>
        <div class="ped-qty">
          <button type="button" data-id="${it.id}" data-d="-1" aria-label="Quitar uno">−</button>
          <span id="q-${it.id}">${cant}</span>
          <button type="button" data-id="${it.id}" data-d="1" aria-label="Agregar uno">+</button>
        </div>
      </div>
    </div>`;
}

function renderMenuPedidos() {
  const grupos = {};
  catalogo.forEach(it => {
    grupos[it.grupo] = grupos[it.grupo] || {};
    (grupos[it.grupo][it.seccion] = grupos[it.grupo][it.seccion] || []).push(it);
  });
  document.getElementById('pedidosMenu').innerHTML = Object.entries(grupos).map(([g, secciones]) =>
    `<h3 class="ped-grupo">${escHtml(g)}</h3>` +
    Object.entries(secciones).map(([s, items]) =>
      `<div class="ped-seccion"><h4>${escHtml(s)}</h4>${items.map(filaPedido).join('')}</div>`
    ).join('')
  ).join('');
}

function actualizarCarrito() {
  const lineas = Object.values(carrito);
  const cont = document.getElementById('carritoLineas');
  cont.innerHTML = lineas.length
    ? lineas.map(l => `<div class="ped-linea"><span>${l.cantidad} × ${escHtml(l.nombre)}${l.variante ? ' (' + escHtml(l.variante) + ')' : ''}</span><span>${fmtPesos(l.precio * l.cantidad)}</span></div>`).join('')
    : 'Aún no has elegido nada.';
  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  document.getElementById('carritoTotal').textContent = fmtPesos(total);
}

function mostrarMensajePedido(texto, esError) {
  const m = document.getElementById('pedMensaje');
  m.textContent = texto;
  m.style.color = esError ? '#B5503B' : '#2E7D5B';
}

async function cargarMenuPedidos() {
  const { data, error } = await db
    .from('menu_items')
    .select('id, grupo, seccion, nombre, descripcion, variante, precio, unidad, orden')
    .eq('activo', true)
    .order('orden');
  if (error || !data) {
    document.getElementById('pedidosMenu').innerHTML = '<p>No se pudo cargar el menú. Intenta más tarde.</p>';
    console.error(error);
    return;
  }
  catalogo = data;
  renderMenuPedidos();
}

// Botones + y − de cada platillo
document.getElementById('pedidosMenu').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-d]');
  if (!b) return;
  const it = catalogo.find(x => x.id === b.dataset.id);
  if (!it) return;
  const actual = carrito[it.id] ? carrito[it.id].cantidad : 0;
  const nueva = Math.min(20, Math.max(0, actual + Number(b.dataset.d)));
  if (nueva === 0) {
    delete carrito[it.id];
  } else {
    carrito[it.id] = { id: it.id, nombre: it.nombre, variante: it.variante, unidad: it.unidad, precio: Number(it.precio), cantidad: nueva };
  }
  document.getElementById('q-' + it.id).textContent = nueva;
  actualizarCarrito();
});

// Enviar pedido
document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('pedNombre').value.trim();
  const telefono = document.getElementById('pedTelefono').value.replace(/\D/g, '');
  const notas = document.getElementById('pedNotas').value.trim();
  const items = Object.values(carrito).map(l => ({ id: l.id, cantidad: l.cantidad }));

  if (!items.length) return mostrarMensajePedido('Elige al menos un platillo.', true);
  if (nombre.length < 2) return mostrarMensajePedido('Escribe tu nombre.', true);
  if (!/^\d{10}$/.test(telefono)) return mostrarMensajePedido('El teléfono debe tener 10 dígitos.', true);

  const btn = document.getElementById('btnPedir');
  btn.disabled = true;
  mostrarMensajePedido('Enviando tu pedido...', false);
  const { data, error } = await db.rpc('crear_pedido', {
    p_telefono: telefono, p_nombre: nombre, p_items: items, p_notas: notas || null
  });
  btn.disabled = false;

  if (error) {
    return mostrarMensajePedido(error.message || 'No se pudo registrar tu pedido. Intenta de nuevo.', true);
  }
  mostrarMensajePedido(`¡Listo, ${nombre.split(' ')[0]}! Tu folio es ${data.folio}. Total: ${fmtPesos(data.total)}. Paga en sucursal al recoger tu pedido.`, false);
  carrito = {};
  renderMenuPedidos();
  actualizarCarrito();
  document.getElementById('pedidoForm').reset();
});

cargarMenuPedidos();
actualizarCarrito();
