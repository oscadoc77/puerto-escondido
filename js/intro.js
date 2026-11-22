// Quita la animación de entrada del DOM cuando termina (no deja capas encima de la página)
setTimeout(function () {
  var intro = document.querySelector('.intro');
  if (intro) intro.remove();
}, 3800);