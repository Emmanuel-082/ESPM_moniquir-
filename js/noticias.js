/**
 * noticias.js
 * Lógica de la página de noticias (noticias.html).
 * Combina dos criterios: el filtro por tipo y el texto del buscador.
 */

const listaNoticias = document.getElementById("listaNoticias");
const buscador = document.getElementById("buscadorNoticias");

let tipoActivo = "Todos"; // filtro elegido actualmente

/** Dibuja las tarjetas que cumplan el filtro y la búsqueda. */
function mostrarNoticias() {
  const texto = buscador.value.trim().toLowerCase();

  const resultado = NOTICIAS.filter(function (noticia) {
    const coincideTipo = tipoActivo === "Todos" || noticia.tipo === tipoActivo;
    // Buscamos el texto en el título y en el resumen
    const coincideTexto =
      noticia.titulo.toLowerCase().includes(texto) ||
      noticia.resumen.toLowerCase().includes(texto);
    return coincideTipo && coincideTexto;
  });

  if (resultado.length === 0) {
    listaNoticias.innerHTML =
      '<div class="tarjeta sin-resultados" style="grid-column:1/-1">No hay noticias que coincidan con tu búsqueda.</div>';
    return;
  }

  listaNoticias.innerHTML = resultado.map(function (noticia) {
    const horario = noticia.horario
      ? '<div class="horario">' + icono("clock") + " " + noticia.horario + "</div>"
      : "";
    // Los comunicados usan icono de información; los cortes y mantenimientos, de alerta o llave
    const iconoTipo = noticia.tipo === "Comunicado" ? "info" : noticia.tipo === "Mantenimiento" ? "wrench" : "alert";

    return (
      '<article class="noticia borde-' + noticia.color + '" data-id="' + noticia.id + '">' +
        '<div class="cabecera">' +
          '<span class="etiqueta et-' + noticia.color + '">' + icono(iconoTipo) + " " + noticia.tipo + "</span>" +
          '<span class="fecha">' + icono("calendar") + " " + noticia.fecha + "</span>" +
        "</div>" +
        "<h3>" + noticia.titulo + "</h3>" +
        "<p>" + noticia.resumen + "</p>" +
        '<p class="detalle">' + noticia.detalle + "</p>" +
        horario +
        '<button type="button" class="leer-mas" data-accion="leer">Leer más ' + icono("chevron-right") + "</button>" +
      "</article>"
    );
  }).join("");
}

// Clic en los botones de filtro
document.getElementById("filtros").addEventListener("click", function (evento) {
  const boton = evento.target.closest(".filtro");
  if (!boton) return;

  document.querySelectorAll(".filtro").forEach(function (b) {
    b.classList.remove("activo");
  });
  boton.classList.add("activo");
  tipoActivo = boton.dataset.tipo;
  mostrarNoticias();
});

// Al escribir en el buscador se actualiza la lista al instante
buscador.addEventListener("input", mostrarNoticias);

// "Leer más" / "Leer menos": muestra u oculta el detalle de la tarjeta
listaNoticias.addEventListener("click", function (evento) {
  const boton = evento.target.closest('[data-accion="leer"]');
  if (!boton) return;

  const tarjeta = boton.closest(".noticia");
  const abierta = tarjeta.classList.toggle("expandida");
  boton.innerHTML = (abierta ? "Leer menos " : "Leer más ") + icono("chevron-right");
});

document.addEventListener("DOMContentLoaded", mostrarNoticias);
