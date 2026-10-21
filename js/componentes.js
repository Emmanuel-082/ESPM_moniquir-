/**
 * componentes.js
 * Construye las partes que se repiten en todas las páginas del portal:
 * la barra de navegación (encabezado) y el pie de página.
 * Así, si cambias un enlace, lo cambias en un solo lugar.
 *
 * En el HTML solo se escribe:
 *   <header id="encabezado"></header>
 *   <footer id="pie"></footer>
 * y la página indica cuál es la actual con <body data-pagina="inicio">.
 */

// Enlaces del menú: [clave de la página, archivo, texto]
const ENLACES_MENU = [
  ["inicio", "index.html", "Inicio"],
  ["facturas", "facturas.html", "Facturas"],
  ["pqr", "pqr.html", "PQR"],
  ["noticias", "noticias.html", "Noticias"],
  ["contacto", "contacto.html", "Contacto"]
];

/** Dibuja la barra de navegación según haya sesión iniciada o no. */
function construirEncabezado() {
  const contenedor = document.getElementById("encabezado");
  if (!contenedor) return;

  const paginaActual = document.body.dataset.pagina;
  const sesion = obtenerSesion();

  // Enlaces del menú, marcando el de la página actual
  const enlaces = ENLACES_MENU.map(function (enlace) {
    const clase = enlace[0] === paginaActual ? ' class="activo"' : "";
    return '<a href="' + enlace[1] + '"' + clase + ">" + enlace[2] + "</a>";
  }).join("");

  // Si hay sesión: saludo + "Cerrar Sesión". Si no: "Iniciar Sesión".
  let botonSesion;
  if (sesion) {
    const primerNombre = (sesion.nombre || sesion.correo).split(/[\s@]/)[0];
    botonSesion =
      '<span class="saludo">Hola, ' + escaparHtml(primerNombre) + "</span>" +
      '<button type="button" class="btn btn-peligro" id="botonCerrarSesion">' +
      icono("log-out") + " Cerrar Sesión</button>";
  } else {
    botonSesion = '<a class="btn btn-contorno" href="login.html">Iniciar Sesión</a>';
  }

  contenedor.className = "encabezado";
  contenedor.innerHTML =
    '<div class="encabezado-interno">' +
      '<a class="marca" href="index.html">' +
        '<img src="img/logo-espm.png" alt="Logo ESPM">' +
        "<span><strong>ESPM</strong><small>Servicios Públicos Moniquirá</small></span>" +
      "</a>" +
      '<button type="button" class="menu-toggle" id="botonMenu" aria-label="Abrir menú" aria-expanded="false">' +
        icono("menu") +
      "</button>" +
      '<nav class="menu" id="menuPrincipal">' +
        '<div class="menu-enlaces">' + enlaces + "</div>" +
        '<div class="menu-acciones">' + botonSesion +
          '<a class="btn btn-primario" href="facturas.html">Pagar Factura</a>' +
        "</div>" +
      "</nav>" +
    "</div>";

  // Botón de hamburguesa (celular): abre y cierra el menú
  document.getElementById("botonMenu").addEventListener("click", function () {
    const menu = document.getElementById("menuPrincipal");
    const abierto = menu.classList.toggle("abierto");
    this.setAttribute("aria-expanded", abierto);
  });

  // Botón "Cerrar Sesión"
  const botonCerrar = document.getElementById("botonCerrarSesion");
  if (botonCerrar) {
    botonCerrar.addEventListener("click", function () {
      cerrarSesion();
      window.location.href = "index.html";
    });
  }
}

/** Dibuja el pie de página. */
function construirPie() {
  const contenedor = document.getElementById("pie");
  if (!contenedor) return;

  const anio = new Date().getFullYear();

  contenedor.className = "pie";
  contenedor.innerHTML =
    '<div class="pie-columnas">' +
      "<div>" +
        '<div class="pie-marca">' +
          '<span class="logo-caja"><img src="img/logo-espm.png" alt="Logo ESPM"></span>' +
          "<span><strong>ESPM</strong><br><small>Servicios Públicos Moniquirá</small></span>" +
        "</div>" +
        "<p>Empresa oficial de agua, alcantarillado y aseo del municipio de Moniquirá, Boyacá.</p>" +
      "</div>" +
      "<div>" +
        "<h4>Servicios</h4>" +
        '<a href="facturas.html">Consultar Factura</a>' +
        '<a href="pqr.html">Radicar PQR</a>' +
        '<a href="noticias.html">Noticias y Comunicados</a>' +
        '<a href="contacto.html">Contáctenos</a>' +
      "</div>" +
      "<div>" +
        "<h4>Contacto</h4>" +
        '<div class="pie-dato">' + icono("phone") + "(098) 726 XXXX</div>" +
        '<div class="pie-dato">' + icono("map-pin") + "Moniquirá, Boyacá</div>" +
        "<div>Lun - Vie: 7:00 AM - 5:00 PM</div>" +
        "<div>Urgencias 24/7</div>" +
      "</div>" +
    "</div>" +
    '<div class="pie-inferior">' +
      "<span>© " + anio + " ESPM – Empresa de Servicios Públicos de Moniquirá. Todos los derechos reservados.</span>" +
      '<div class="redes">' +
        '<a href="#" aria-label="Facebook">' + icono("facebook") + "</a>" +
        '<a href="#" aria-label="Instagram">' + icono("instagram") + "</a>" +
        '<a href="#" aria-label="Twitter">' + icono("twitter") + "</a>" +
        '<a href="#" aria-label="YouTube">' + icono("youtube") + "</a>" +
      "</div>" +
    "</div>";
}

// Al cargar la página: construimos las piezas y pintamos los iconos del HTML
document.addEventListener("DOMContentLoaded", function () {
  construirEncabezado();
  construirPie();
  pintarIconos();
});
