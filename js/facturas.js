/**
 * facturas.js
 * Lógica de la página de facturas (facturas.html).
 * Busca en los datos de ejemplo de js/datos.js (FACTURAS_DEMO).
 *
 * Pruebas rápidas: busca "001-2345-6" o la cédula "1234567890".
 */

const formFacturas = document.getElementById("formFacturas");
const contenedorResultados = document.getElementById("resultados");

formFacturas.addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(formFacturas);

  const termino = document.getElementById("busqueda").value.trim();

  // Validación: no se puede buscar con el campo vacío
  if (termino === "") {
    marcarError("busqueda", "Escribe un número de cuenta, cédula o NIT.");
    contenedorResultados.innerHTML = "";
    return;
  }

  const cuenta = FACTURAS_DEMO[termino];

  if (!cuenta) {
    contenedorResultados.innerHTML =
      '<div class="tarjeta sin-resultados">' + icono("search") +
      " No encontramos facturas para <strong>" + escaparHtml(termino) + "</strong>. " +
      "Verifica el número e inténtalo de nuevo.</div>";
    return;
  }

  mostrarFacturas(cuenta);
});

/** Dibuja la lista de facturas de una cuenta. */
function mostrarFacturas(cuenta) {
  // REQ-003: avisar al usuario si tiene facturas pendientes por vencer
  const pendiente = cuenta.facturas.find(function (f) {
    return f.estado === "Pendiente";
  });
  const aviso = pendiente
    ? '<div class="aviso-vence">' + icono("bell") +
      " Tienes una factura pendiente (" + pendiente.periodo + "). Vence el " + pendiente.vence + ".</div>"
    : "";

  const filas = cuenta.facturas.map(function (f) {
    const colorEtiqueta = f.estado === "Pagada" ? "et-verde" : "et-amarillo";
    const botonPagar = f.estado === "Pendiente"
      ? '<button type="button" class="btn btn-primario" data-accion="pagar" data-periodo="' + f.periodo + '">Pagar</button>'
      : "";

    return (
      '<div class="factura">' +
        "<div><h3>Factura " + f.periodo + "</h3><small>Vence: " + f.vence + "</small></div>" +
        '<span class="etiqueta ' + colorEtiqueta + '">' + f.estado + "</span>" +
        '<span class="valor">' + formatearPesos(f.valor) + "</span>" +
        botonPagar +
      "</div>"
    );
  }).join("");

  contenedorResultados.innerHTML =
    '<div class="tarjeta">' +
      "<h2>Suscriptor: " + cuenta.suscriptor + " · Cuenta " + cuenta.cuenta + "</h2>" +
      aviso + filas +
    "</div>";
}

// Un solo "oyente" para todos los botones Pagar (aunque se creen después)
contenedorResultados.addEventListener("click", function (evento) {
  const boton = evento.target.closest('[data-accion="pagar"]');
  if (boton) {
    mostrarToast("Pago de " + boton.dataset.periodo + ": en el sistema real aquí se abre la pasarela de pagos.");
  }
});
