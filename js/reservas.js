const SUPABASE_URL = 'https://qrtngsebgxfgtkzudfey.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uYNvIEgQk1mpEMMBJkCB8w_d3BlPuuC';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- horarios disponibles según el día seleccionado ----
const horariosPorDia = {
  0: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
  1: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
  2: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
  3: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
  4: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
  5: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
  6: ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"]
};

const fechaInput = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');
const form = document.getElementById('resForm');
const confirmBlock = document.getElementById('confirmBlock');
const folioPreview = document.getElementById('folioPreview');
const submitBtn = form.querySelector('.submit-btn');

// fecha mínima = hoy
const hoy = new Date();
fechaInput.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split('T')[0];

function generarFolio() {
  return 'RZ-' + Math.floor(1000 + Math.random() * 9000);
}
let folioActual = generarFolio();
folioPreview.textContent = folioActual;

fechaInput.addEventListener('change', () => {
  const dia = new Date(fechaInput.value + 'T00:00:00').getDay();
  const horas = horariosPorDia[dia] || [];
  horaSelect.innerHTML = '<option value="">Selecciona</option>';
  if (horas.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = 'Cerrado este día';
    opt.disabled = true;
    horaSelect.appendChild(opt);
  } else {
    horas.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      horaSelect.appendChild(opt);
    });
  }
});

const WHATSAPP_NEGOCIO = '523331622257';

function marcarError(campoId, esValido) {
  const campo = document.getElementById(campoId);
  campo.classList.toggle('error', !esValido);
}

function validarTelefono(v) {
  return /^\d{10}$/.test(v.replace(/\D/g, ''));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const fecha = fechaInput.value;
  const hora = horaSelect.value;
  const personas = document.getElementById('personas').value;
  const telefonoLimpio = document.getElementById('telefono').value.replace(/\D/g, '');
  const notas = document.getElementById('notas').value.trim();

  let valido = true;
  marcarError('field-nombre', nombre.length > 1); if (nombre.length <= 1) valido = false;
  marcarError('field-fecha', !!fecha); if (!fecha) valido = false;
  marcarError('field-hora', !!hora); if (!hora) valido = false;
  marcarError('field-personas', !!personas); if (!personas) valido = false;
  marcarError('field-telefono', validarTelefono(telefonoLimpio)); if (!validarTelefono(telefonoLimpio)) valido = false;

  if (!valido) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Registrando mesa...';

  // Llamada a la función SQL en Supabase
  const { data, error } = await db.rpc('registrar_reservacion', {
    p_telefono: telefonoLimpio,
    p_nombre: nombre,
    p_fecha: fecha,
    p_hora: hora,
    p_personas: parseInt(personas, 10),
    p_notas: notas,
    p_folio: folioActual
  });

  submitBtn.disabled = false;
  submitBtn.textContent = 'Confirmar reservación';

  if (error) {
    console.error('Error al guardar en SQL:', error);
    alert('No se pudo registrar la reservación en este momento. Intenta de nuevo.');
    return;
  }

  // Respaldo opcional por WhatsApp
  const texto = [
    'Hola, acabo de registrar mi reservación en la web de Puerto Escondido.',
    `Folio: ${folioActual}`,
    `Nombre: ${nombre}`,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`,
    `Personas: ${personas}`
  ].join('\n');
  document.getElementById('waLink').href =
    `https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(texto)}`;

  const primerNombre = nombre.split(' ')[0];
  // La función ya no indica si el cliente vino antes (no revela datos de otros clientes)
  document.getElementById('confirmName').textContent =
    `¡Listo, ${primerNombre}! Tu mesa quedó registrada.`;

  document.getElementById('confirmDetails').textContent =
    `Mesa para ${personas} · ${fecha} a las ${hora}`;
  document.getElementById('confirmFolio').textContent = `Folio ${folioActual}`;

  form.classList.add('hidden');
  confirmBlock.classList.add('show');
});

document.getElementById('newReservation').addEventListener('click', () => {
  form.reset();
  horaSelect.innerHTML = '<option value="">Selecciona</option>';
  document.querySelectorAll('.field').forEach(f => f.classList.remove('error'));
  folioActual = generarFolio();
  folioPreview.textContent = folioActual;
  confirmBlock.classList.remove('show');
  form.classList.remove('hidden');
});