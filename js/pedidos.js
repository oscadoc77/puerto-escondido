// Página pedidos.html: menú para recoger en sucursal. El total lo calcula el servidor (crear_pedido).
const SUPABASE_URL = 'https://qrtngsebgxfgtkzudfey.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uYNvIEgQk1mpEMMBJkCB8w_d3BlPuuC';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const WA_NUM = '523331622257';
const DIRECCION = 'Av. Miguel López de Legaspi 1934, Guadalajara';
const PREPARACION_MIN = 20; // confirmar con el restaurante
const MAX_CANT = 20;

let catalogo = [];
let carrito = {};
let tocado = { nombre: false, telefono: false };

const $ = id => document.getElementById(id);
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const pesos = n => '$' + Number(n).toLocaleString('es-MX', { maximumFractionDigits: 0 });
const slug = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const waLink = t => 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(t);
const nombreVal = () => $('pedNombre').value.trim();
const telVal = () => $('pedTelefono').value.replace(/\D/g, '');
const piezasCarrito = () => Object.values(carrito).reduce((s, l) => s + l.cantidad, 0);
const totalCarrito = () => Object.values(carrito).reduce((s, l) => s + l.precio * l.cantidad, 0);

// grupo -> sección -> platillo (nombre) -> tamaños/variantes
function agrupar() {
  const grupos = new Map();
  for (const it of catalogo) {
    if (!grupos.has(it.grupo)) grupos.set(it.grupo, new Map());
    const secciones = grupos.get(it.grupo);
    if (!secciones.has(it.seccion)) secciones.set(it.seccion, new Map());
    const platillos = secciones.get(it.seccion);
    if (!platillos.has(it.nombre)) platillos.set(it.nombre, { nombre: it.nombre, descripcion: it.descripcion, variantes: [] });
    platillos.get(it.nombre).variantes.push(it);
  }
  return grupos;
}

function htmlPlatillo(p) {
  const soloConsulta = p.variantes.every(v => v.precio == null);
  const controles = soloConsulta
    ? `<a class="ped-wa" href="tel:+${WA_NUM}">Llamar al restaurante</a>`
    : p.variantes.filter(v => v.precio != null).map(v => {
        const cant = carrito[v.id] ? carrito[v.id].cantidad : 0;
        const etiqueta = [p.nombre, v.variante].filter(Boolean).join(' ');
        return `<div class="ped-var">
            ${v.variante ? `<span class="ped-talla">${esc(v.variante)}</span>` : ''}
            <span class="ped-precio">${pesos(v.precio)}${v.unidad ? '/' + esc(v.unidad) : ''}</span>
            <div class="ped-qty">
              <button type="button" data-id="${v.id}" data-d="-1" aria-label="Quitar uno: ${esc(etiqueta)}" ${cant === 0 ? 'disabled' : ''}>−</button>
              <output id="q-${v.id}" aria-live="polite">${cant}</output>
              <button type="button" data-id="${v.id}" data-d="1" aria-label="Agregar uno: ${esc(etiqueta)}" ${cant >= MAX_CANT ? 'disabled' : ''}>+</button>
            </div>
          </div>`;
      }).join('');
  return `<article class="ped-platillo" data-nombre="${esc(p.nombre.toLowerCase())}">
      <div class="ped-info">
        <p class="ped-nombre">${esc(p.nombre)}</p>
        ${p.descripcion ? `<p class="ped-desc">${esc(p.descripcion)}</p>` : ''}
      </div>
      <div class="ped-vars">${controles}</div>
    </article>`;
}

function renderMenu() {
  let chips = '', html = '';
  for (const [g, secciones] of agrupar()) {
    const id = 'g-' + slug(g);
    chips += `<a href="#${id}">${esc(g)}</a>`;
    html += `<section class="ped-grupo" id="${id}"><h3>${esc(g)}</h3>`;
    for (const [s, platillos] of secciones) {
      const lista = [...platillos.values()].map(htmlPlatillo).join('');
      html += platillos.size === 1 ? lista : `<div class="ped-seccion"><h4>${esc(s)}</h4>${lista}</div>`;
    }
    html += '</section>';
  }
  $('chips').innerHTML = chips;
  $('pedidosMenu').innerHTML = html;
}

function actualizarResumen() {
  const lineas = Object.values(carrito);
  $('carritoLineas').innerHTML = lineas.length
    ? lineas.map(l => `<div class="ped-linea"><span>${l.cantidad} × ${esc(l.nombre)}${l.variante ? ' ' + esc(l.variante) : ''}</span><span>${pesos(l.precio * l.cantidad)}</span></div>`).join('')
    : '<p class="ped-vacio">Tu pedido está vacío. Toca + en cualquier platillo para empezar.</p>';
  const piezas = piezasCarrito();
  $('carritoTotal').textContent = pesos(totalCarrito());
  $('barraTexto').textContent = `${piezas} ${piezas === 1 ? 'artículo' : 'artículos'} · ${pesos(totalCarrito())}`;
  validarFormulario();
}

function validarFormulario() {
  const nombreOk = nombreVal().length >= 2;
  const telOk = telVal().length === 10;
  const hayItems = piezasCarrito() > 0;
  if (tocado.nombre) $('errNombre').textContent = nombreOk ? '' : '¿A nombre de quién es el pedido?';
  if (tocado.telefono) $('errTelefono').textContent = telOk ? '' : 'Escribe tu teléfono de 10 dígitos, sin espacios.';
  const btn = $('btnPedir');
  btn.disabled = !(hayItems && nombreOk && telOk);
  btn.textContent = !hayItems ? 'Agrega platillos para continuar'
    : !(nombreOk && telOk) ? 'Escribe tu nombre y teléfono'
    : `Confirmar pedido · ${pesos(totalCarrito())}`;
}

function mensaje(texto, tipo) {
  const m = $('pedMensaje');
  m.textContent = texto;
  m.className = 'ped-msg' + (tipo ? ' ' + tipo : '');
}

// + y − por tamaño
$('pedidosMenu').addEventListener('click', e => {
  const b = e.target.closest('button[data-d]');
  if (!b) return;
  const v = catalogo.find(x => x.id === b.dataset.id);
  if (!v) return;
  const actual = carrito[v.id] ? carrito[v.id].cantidad : 0;
  const nueva = Math.min(MAX_CANT, Math.max(0, actual + Number(b.dataset.d)));
  if (nueva === 0) delete carrito[v.id];
  else carrito[v.id] = { id: v.id, nombre: v.nombre, variante: v.variante, precio: Number(v.precio), unidad: v.unidad, cantidad: nueva };
  $('q-' + v.id).textContent = nueva;
  document.querySelectorAll(`button[data-id="${v.id}"][data-d="-1"]`).forEach(x => x.disabled = nueva === 0);
  document.querySelectorAll(`button[data-id="${v.id}"][data-d="1"]`).forEach(x => x.disabled = nueva >= MAX_CANT);
  actualizarResumen();
});

// Buscador: oculta platillos que no coinciden y secciones vacías
$('buscar').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.ped-platillo').forEach(el => { el.hidden = q !== '' && !el.dataset.nombre.includes(q); });
  document.querySelectorAll('.ped-seccion, .ped-grupo').forEach(sec => {
    sec.hidden = ![...sec.querySelectorAll('.ped-platillo')].some(x => !x.hidden);
  });
});

// Validación en vivo
$('pedNombre').addEventListener('input', validarFormulario);
$('pedNombre').addEventListener('blur', () => { tocado.nombre = true; validarFormulario(); });
$('pedTelefono').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  validarFormulario();
});
$('pedTelefono').addEventListener('blur', () => { tocado.telefono = true; validarFormulario(); });

$('pedidoForm').addEventListener('submit', async e => {
  e.preventDefault();
  if ($('btnPedir').disabled) return;
  const items = Object.values(carrito).map(l => ({ id: l.id, cantidad: l.cantidad }));
  const notas = $('pedNotas').value.trim();
  const btn = $('btnPedir');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  mensaje('Enviando tu pedido...', '');
  const { data, error } = await db.rpc('crear_pedido', {
    p_telefono: telVal(), p_nombre: nombreVal(), p_items: items, p_notas: notas || null
  });
  if (error) {
    mensaje(error.message || 'No se pudo registrar tu pedido. Intenta de nuevo.', 'error');
    validarFormulario();
    return;
  }
  mensaje(`¡Pedido recibido! Folio ${data.folio}. Total ${pesos(data.total)}, pagas al recoger en ${DIRECCION}. Tiempo aprox. de preparación: ${PREPARACION_MIN} min.`, 'ok');
  carrito = {};
  tocado = { nombre: false, telefono: false };
  $('pedidoForm').reset();
  $('errNombre').textContent = '';
  $('errTelefono').textContent = '';
  renderMenu();
  actualizarResumen();
  $('pedMensaje').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

async function cargarMenu() {
  const { data, error } = await db
    .from('menu_items')
    .select('id, grupo, seccion, nombre, descripcion, variante, precio, unidad, orden')
    .eq('activo', true)
    .order('orden');
  if (error || !data) {
    console.error(error);
    $('pedidosMenu').innerHTML = '<p class="ped-msg error">No se pudo cargar el menú. Recarga la página en unos minutos.</p>';
    return;
  }
  catalogo = data;
  $('buscar').disabled = false;
  renderMenu();
}

// Altura real del encabezado fijo, para que la barra de búsqueda y el carrito queden justo debajo
function ajustarSticky() {
  const h = document.querySelector('header.site');
  const alto = h ? Math.ceil(h.getBoundingClientRect().height) : 90;
  document.documentElement.style.setProperty('--hdr', (alto + 8) + 'px');
}
window.addEventListener('resize', ajustarSticky);
ajustarSticky();

actualizarResumen();
cargarMenu();
