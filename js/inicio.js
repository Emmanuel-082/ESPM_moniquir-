/**
 * inicio.js
 * Lógica de la página de inicio (index.html):
 *   1. Aviso amarillo de corte programado
 *   2. Carrusel con cambio automático
 *   3. Lista de últimos comunicados
 */

/* ============================================================
   1. AVISO DE CORTE PROGRAMADO
   Toma el primer comunicado de tipo "Corte" de js/datos.js
   ============================================================ */
function construirAviso() {
  const corte = NOTICIAS.find(function (noticia) {
    return noticia.tipo === "Corte";
  });
  const caja = document.getElementById("avisoCorte");

  if (!corte) {
    caja.classList.add("oculto"); // si no hay cortes, no mostramos el aviso
    return;
  }

  caja.innerHTML =
    "<strong>" + icono("alert") + " " + corte.tituloCorto + " — " + corte.fecha + "</strong>" +
    "<small>" + corte.horario + ". Recomendamos almacenar agua con anticipación.</small>";
}

/* ============================================================
   2. CARRUSEL
   ============================================================ */

// Cada diapositiva: fondo, etiqueta, título, texto y botones
const DIAPOSITIVAS = [
  {
    fondo: "fondo-agua",
    iconoEtiqueta: "droplets",
    etiqueta: "Agua y Alcantarillado",
    titulo: "Agua limpia para todos",
    texto: "Consulta el estado de la red, los cortes programados y los trabajos de mantenimiento de tu sector.",
    botones: [
      { texto: "Ver Noticias", enlace: "noticias.html", icono: "newspaper", clase: "btn-claro" },
      { texto: "Contáctanos", enlace: "contacto.html", icono: "alert", clase: "btn-fantasma" }
    ]
  },
  {
    fondo: "fondo-factura",
    iconoEtiqueta: "file-text",
    etiqueta: "Facturación en línea",
    titulo: "Consulta y paga tu factura",
    texto: "Revisa el estado de tus facturas con tu número de cuenta o cédula, de forma rápida y segura.",
    botones: [
      { texto: "Consultar Factura", enlace: "facturas.html", icono: "file-text", clase: "btn-claro" },
      { texto: "Contáctanos", enlace: "contacto.html", icono: "alert", clase: "btn-fantasma" }
    ]
  },
  {
    fondo: "fondo-aseo",
    iconoEtiqueta: "bell",
    etiqueta: "Aseo y Recolección de Basuras",
    titulo: "Un Moniquirá más limpio",
    texto: "Rutas de recolección eficientes, puntos ecológicos y programas de reciclaje para cuidar el medio ambiente.",
    botones: [
      { texto: "Ver Horarios", enlace: "noticias.html", icono: "file-text", clase: "btn-claro" },
      { texto: "Contáctanos", enlace: "contacto.html", icono: "alert", clase: "btn-fantasma" }
    ]
  },
  {
    fondo: "fondo-pqr",
    iconoEtiqueta: "message",
    etiqueta: "Peticiones, quejas y reclamos",
    titulo: "Tu opinión nos importa",
    texto: "Radica tu PQR en línea y consulta su estado en cualquier momento. Respondemos en máximo 15 días hábiles.",
    botones: [
      { texto: "Radicar PQR", enlace: "pqr.html", icono: "send", clase: "btn-claro" },
      { texto: "Contáctanos", enlace: "contacto.html", icono: "alert", clase: "btn-fantasma" }
    ]
  }
];

let diapositivaActual = 0;     // índice de la diapositiva que se está viendo
let temporizadorCarrusel = null;

/** Crea el HTML del carrusel a partir de la lista DIAPOSITIVAS. */
function construirCarrusel() {
  const carrusel = document.getElementById("carrusel");

  // Diapositivas
  const diapositivas = DIAPOSITIVAS.map(function (d) {
    const botones = d.botones.map(function (b) {
      return '<a class="btn ' + b.clase + '" href="' + b.enlace + '">' + icono(b.icono) + " " + b.texto + "</a>";
    }).join("");

    return (
      '<div class="diapositiva ' + d.fondo + '">' +
        '<span class="etiqueta-hero">' + icono(d.iconoEtiqueta) + " " + d.etiqueta + "</span>" +
        "<h1>" + d.titulo + "</h1>" +
        "<p>" + d.texto + "</p>" +
        '<div class="botones">' + botones + "</div>" +
      "</div>"
    );
  }).join("");

  // Puntos de navegación (uno por diapositiva)
  const puntos = DIAPOSITIVAS.map(function (d, indice) {
    return '<button type="button" class="punto" data-indice="' + indice + '" aria-label="Ir a la diapositiva ' + (indice + 1) + '"></button>';
  }).join("");

  carrusel.innerHTML =
    diapositivas +
    '<button type="button" class="flecha izquierda" id="flechaAnterior" aria-label="Anterior">' + icono("chevron-left") + "</button>" +
    '<button type="button" class="flecha derecha" id="flechaSiguiente" aria-label="Siguiente">' + icono("chevron-right") + "</button>" +
    '<span class="contador" id="contadorCarrusel"></span>' +
    '<div class="puntos">' + puntos + "</div>";

  // Eventos de las flechas y los puntos
  document.getElementById("flechaAnterior").addEventListener("click", function () {
    irADiapositiva(diapositivaActual - 1);
    reiniciarTemporizador();
  });
  document.getElementById("flechaSiguiente").addEventListener("click", function () {
    irADiapositiva(diapositivaActual + 1);
    reiniciarTemporizador();
  });
  carrusel.querySelectorAll(".punto").forEach(function (punto) {
    punto.addEventListener("click", function () {
      irADiapositiva(Number(punto.dataset.indice));
      reiniciarTemporizador();
    });
  });

  // Pausa el cambio automático mientras el mouse está encima
  carrusel.addEventListener("mouseenter", function () {
    clearInterval(temporizadorCarrusel);
  });
  carrusel.addEventListener("mouseleave", reiniciarTemporizador);

  irADiapositiva(0);
  reiniciarTemporizador();
}

/** Muestra la diapositiva con el índice dado (da la vuelta al llegar al final). */
function irADiapositiva(indice) {
  const total = DIAPOSITIVAS.length;
  diapositivaActual = (indice + total) % total;  // evita índices fuera de rango

  document.querySelectorAll(".diapositiva").forEach(function (d, i) {
    d.classList.toggle("activa", i === diapositivaActual);
  });
  document.querySelectorAll(".punto").forEach(function (p, i) {
    p.classList.toggle("activo", i === diapositivaActual);
  });
  document.getElementById("contadorCarrusel").textContent = (diapositivaActual + 1) + " / " + total;
}

/** (Re)inicia el cambio automático cada 6 segundos. */
function reiniciarTemporizador() {
  clearInterval(temporizadorCarrusel);
  temporizadorCarrusel = setInterval(function () {
    irADiapositiva(diapositivaActual + 1);
  }, 6000);
}

/* ============================================================
   3. ÚLTIMOS COMUNICADOS (los 3 primeros de js/datos.js)
   ============================================================ */
function construirComunicados() {
  const lista = document.getElementById("listaComunicados");

  lista.innerHTML = NOTICIAS.slice(0, 3).map(function (noticia) {
    const horario = noticia.horario ? "<small>" + noticia.horario + "</small>" : "";
    return (
      '<div class="comunicado">' +
        '<span class="etiqueta et-' + noticia.color + '">' + noticia.tipo + "</span>" +
        '<div class="info"><strong>' + noticia.tituloCorto + "</strong>" + horario + "</div>" +
        '<span class="fecha">' + noticia.fecha + "</span>" +
      "</div>"
    );
  }).join("");
}

/* ---------- Arranque ---------- */
// componentes.js ya registró su propio evento; este se ejecuta después, en orden
document.addEventListener("DOMContentLoaded", function () {
  construirAviso();
  construirCarrusel();
  construirComunicados();
});
