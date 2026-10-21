/**
 * recuperar.js
 * Lógica de la pantalla "Recuperar contraseña" (recuperar.html).
 *
 * NOTA: la API de la AA5 no incluye un servicio para enviar correos de
 * recuperación, por eso aquí solo se valida el correo y se muestra la
 * pantalla de confirmación del diseño. Cuando exista ese servicio en el
 * back-end, aquí se llamaría con fetch() como en js/api.js.
 */

const formRecuperar = document.getElementById("formRecuperar");
const estadoFormulario = document.getElementById("estadoFormulario");
const estadoEnviado = document.getElementById("estadoEnviado");

formRecuperar.addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(formRecuperar);

  const correo = document.getElementById("correo").value.trim();

  if (!esCorreoValido(correo)) {
    marcarError("correo", "Escribe un correo electrónico válido.");
    return;
  }

  // Cambiamos de pantalla: ocultamos el formulario y mostramos la confirmación
  document.getElementById("correoDestino").textContent = correo;
  estadoFormulario.classList.add("oculto");
  estadoEnviado.classList.remove("oculto");
});

// "Intentar con otro correo": volvemos al formulario vacío
document.getElementById("botonOtroCorreo").addEventListener("click", function () {
  formRecuperar.reset();
  estadoEnviado.classList.add("oculto");
  estadoFormulario.classList.remove("oculto");
  document.getElementById("correo").focus();
});
