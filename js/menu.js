// ---- Carta completa de Puerto Escondido ----
const MENU_WA = '523312345678'; // mismo número que usas en la reservación, sin +

// Formato de cada platillo: [nombre, precio(s)..., '~descripción' opcional]
// Precios con etiqueta: 'CH $140'. 'CONSULTAR' muestra el botón de WhatsApp.
const cf = n => [n, 'CAM $218', 'FILETE $205'];

const MENU = [
  { g: 'Mariscos', c: [
    { t: 'Platillo por temporada', i: [
      ['Platillo de temporada', 'CONSULTAR']
    ]},
    { t: 'Cocteles', i: [
      ['Cóctel de camarón', 'CH $140', 'M $178', 'G $225'],
      ['Cóctel de pulpo y camarón', 'CH $175', 'M $205', 'G $245'],
      ['Cóctel de pulpo', 'CH $175', 'M $220', 'G $270'],
      ['Cóctel especial', 'CH $185', 'M $220', 'G $245'],
      ['Caldo de cahuamanta especial', '$210', '~Pulpo, camarón y callo de almeja'],
      ['Caldo de cahuamanta sencillo', '$160', '~Camarón, pulpo y callo de almeja'],
      ['Sopa del Puerto', '$248']
    ]},
    { t: 'Ceviches', i: [
      ['Ceviche de pescado molido', 'TOST $43', 'ORDEN $195'],
      ['Ceviche de pescado en trozo', 'TOST $52', 'ORDEN $215'],
      ['Ceviche de camarón', 'TOST $72', 'ORDEN $235'],
      ['Ceviche de camarón seco', 'TOST $80', 'ORDEN $250'],
      ['Ceviche de atún fresco', 'TOST $82', 'ORDEN $260'],
      ['Ceviche especial', 'TOST $85', 'ORDEN $260'],
      ['Estofado de marlín', 'TOST $43', 'ORDEN $190', '~Pulpo, camarón y callo de almeja'],
      ['Ensalada de pulpo', 'TOST $98', 'ORDEN $325'],
      ['Aguachile verde, rojo o negro', 'TOST $82', 'ORDEN $242'],
      ['Tostada de jaiba', '$90']
    ]},
    { t: 'Pescado frito', i: [
      ['Huachinango', '$275 pza.'],
      ['Mojarra', '$185 pza.']
    ]},
    { t: 'Pescado zarandeado', i: [
      ['Curvina', '$460/kg'],
      ['Huachinango', '$460/kg'],
      ['Lonja de dorado (230 g)', '$275']
    ]},
    { t: 'Camarones y filete (dorado)', n: 'Adicionales: pregunta en el restaurante', i: [
      cf('Diabla'), cf('Ajo y ajillo'), cf('Empanizados'), cf('Tamarindo'),
      ['Zarandeado', 'CAM $238', 'FILETE $205'],
      cf('Chipotle con tequila'), cf('Rockefeller'), cf('A la plancha'),
      cf('Al pastor'), cf('Mostaza con miel'), cf('Cilantro con nuez'),
      cf('Almendrados'), cf('Salsa champiñón')
    ]}
  ]},
  { g: 'Camarones, pulpo y botanas', c: [
    { t: 'Pulpo', i: [
      ['Zarandeado', '$330'], ['Ajo y ajillo', '$310'],
      ['Diabla', '$310'], ['Pulpo tatemado', '$310']
    ]},
    { t: 'Botanas del Puerto', i: [
      ['Cecina de pez', 'CH $235', 'G $275'],
      ['Chicharrón de pescado', 'CH $235', 'G $275'],
      ['Botana mixta del Puerto', 'CH $290', 'G $360'],
      ['Camarón para pelar', '$235'],
      ['Callo de hacha', 'CONSULTAR'],
      ['Molcajete de mariscos', '$285', '~Frío o caliente'],
      ['Sashimi de atún o salmón', '$280'],
      ['Chicharrón de atún chica', 'CH $250', 'G $305'],
      ['Chicharrón de pulpo', '$280']
    ]},
    { t: 'Especialidades', i: [
      ['Alambre de camarón', '$225'],
      ['Piña rellena de mariscos', '$275'],
      ['Salmón relleno', '$298'],
      ['Filete relleno', '$265'],
      ['Langosta al gusto', 'CONSULTAR'],
      ['Camarón al coco relleno de queso', '$245'],
      ['Fetuccini de camarón', '$240'],
      ['Fetuccini de pulpo', '$275'],
      ['Medallón de atún al gusto', '$265'],
      ['Combinado a la talla', '$320'],
      ['Langostino al gusto', 'CONSULTAR'],
      ['Camarones momia', '$245'],
      ['Jaibas rellenas', '$242'],
      ['Pez espada al gusto (250 g)', '$280'],
      ['Filete escondido', '$280']
    ]}
  ]},
  { g: 'Especialidades, infantil y tacos', c: [
    { t: 'Infantil', i: [
      ['Palomitas de camarón', '$140'],
      ['Hamburguesa (pescado o camarón)', '$145'],
      ['Filete junior', '$145', '~Empanizado o a la plancha'],
      ['Camarón junior', '$145', '~Empanizado o a la plancha']
    ]},
    { t: 'En su concha', i: [
      ['Ostiones concha', '$180'],
      ['Ostiones zarandeados', '$210'],
      ['Ostiones Rockefeller', '$260'],
      ['Almeja reina', '$125 pza.']
    ]},
    { t: 'Tacos', i: [
      ['Gobernador (camarón con queso)', '$82'],
      ['Marlín (marlín y queso)', '$55'],
      ['Burrito marinero (camarón o marlín)', '$158']
    ]},
    { t: 'Carnes y aves', i: [
      ['Fajita de res o pollo', '$190'],
      ['Milanesa de pollo', '$185'],
      ['Arrachera zarandeada (240 g)', '$225'],
      ['Rib eye', '$298'],
      ['Picaña', '$278']
    ]},
    { t: 'Guarniciones extras', i: [
      ['Orden arroz', '$50'], ['Orden papa francesa', '$70'],
      ['Orden aguacate', '$50'], ['Orden guacamole', '$75'],
      ['Orden queso', '$40'], ['Orden ensalada dulce', '$50'],
      ['Consomé', '$55'], ['Queso extra', '$45']
    ]},
    { t: 'Preparados', i: [
      ['Michelada', '$95'], ['Clamato', '$60'], ['Pirata', '$95'],
      ['Bull', '$120'], ['Calimocho', '$90'], ['Frutos rojos', '$85']
    ]}
  ]},
  { g: 'Bebidas y postres', c: [
    { t: 'Bebidas', i: [
      ['Naranjada', '$55'], ['Limonada', '$55'],
      ['Agua fresca del día', '$45'], ['Agua embotellada', '$40'],
      ['Refresco', '$40'], ['Agua de coco', '$70'],
      ['Bebidas preparadas', '$60', '~Maracuyá, fresa, kiwi, pepino, hierbabuena, guanábana']
    ]},
    { t: 'Cerveza', i: [
      ['Corona clara, oscura y light', '$48'], ['Pacífico', '$48'],
      ['Victoria', '$48'], ['Modelo negra o especial', '$55'],
      ['Ultra', '$48'], ['Caguama Corona', '$108']
    ]},
    { t: 'Cerveza artesanal', i: [
      ['Colimita', '$85'], ['Piedra Lisa', '$85'], ['Cayaco', '$65']
    ]},
    { t: 'Postres y café', i: [
      ['Plátanos flameados', '$88'], ['Pastel del día', '$95'],
      ['Café capuchino', '$52'], ['Café expreso o americano', '$45'],
      ['Carajillo', '$110'], ['Canija', '$100'],
      ['Frappuccino', '$95'], ['Capuchino con licor', '$122'],
      ['Helado de vainilla/chocolate', '$80'], ['Pan de elote', '$95']
    ]}
  ]}
];

function linkWA(texto){
  return 'https://wa.me/' + MENU_WA + '?text=' + encodeURIComponent(texto);
}

function fila(it){
  const nombre = it[0];
  const desc = it.filter(x => x[0] === '~').map(x => x.slice(1));
  const precios = it.slice(1).filter(x => x[0] !== '~');
  let derecha;
  if (precios[0] === 'CONSULTAR') {
    derecha = `<a class="m-wa" target="_blank" rel="noopener" href="${linkWA('Hola, quisiera consultar el precio de: ' + nombre + ' (Puerto Escondido)')}">Consultar por WhatsApp</a>`;
  } else {
    derecha = '<div class="m-precios">' + precios.map(p => {
      const m = p.match(/^([A-Z]+) (.*)$/);
      return m ? `<span class="m-pr"><small>${m[1]}</small>${m[2]}</span>`
               : `<span class="m-pr">${p}</span>`;
    }).join('') + '</div>';
  }
  return `<div class="m-item"><div><span class="m-nombre">${nombre}</span>${desc.map(d => `<span class="m-desc">${d}</span>`).join('')}</div>${derecha}</div>`;
}

const jump = document.getElementById('menuJump');
const lista = document.getElementById('menuLista');

MENU.forEach(g => {
  const id = g.g.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  jump.insertAdjacentHTML('beforeend', `<a href="#${id}">${g.g}</a>`);
  const cats = g.c.map(c =>
    `<div class="m-cat"><h3>${c.t}</h3>${c.n ? `<p class="m-nota">${c.n}</p>` : ''}${c.i.map(fila).join('')}</div>`
  ).join('');
  lista.insertAdjacentHTML('beforeend',
    `<div class="m-grupo" id="${id}"><h2>${g.g}</h2><div class="m-cards">${cats}</div></div>`);
});

// Resalta en el menú de categorías la sección que se está viendo
const enlacesJump = [...document.querySelectorAll('#menuJump a')];
const seccionesMenu = enlacesJump.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observadorMenu = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      enlacesJump.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
seccionesMenu.forEach(sec => observadorMenu.observe(sec));
