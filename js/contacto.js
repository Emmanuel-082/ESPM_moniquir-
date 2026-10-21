/**
 * contacto.js
 * Lógica del formulario de contacto (contacto.html).
 * Valida los datos y muestra una confirmación. Cuando el back-end tenga un
 * servicio para recibir mensajes, aquí se enviaría con fetch().
 */

const formContacto = document.getElementById("formContacto");

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(formContacto);
  document.getElementById("mensaje").className = "mensaje";

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.replace(/\s/g, "");
  const correo = document.getElementById("correo").value.trim();
  const texto = document.getElementById("mensajeTexto").value.trim();

  let valido = true;

  if (nombre.length < 3) {
    marcarError("nombre", "Escribe tu nombre.");
    valido = false;
  }
  if (!esTelefonoValido(telefono)) {
    marcarError("telefono", "Debe tener 10 números.");
    valido = false;
  }
  if (!esCorreoValido(correo)) {
    marcarError("correo", "Correo no válido.");
    valido = false;
  }
  if (texto.length < 10) {
    marcarError("mensajeTexto", "Escribe tu mensaje (mínimo 10 caracteres).");
    valido = false;
  }
  if (!valido) return;

  mostrarMensaje("mensaje", true, "¡Mensaje enviado! Te responderemos en 1 a 3 días hábiles.");
  formContacto.reset();
});
