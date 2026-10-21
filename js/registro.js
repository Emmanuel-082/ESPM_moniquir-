/**
 * registro.js
 * Lógica del registro en 3 pasos (registro.html).
 *
 * Idea general: la página tiene 3 bloques (paso-1, paso-2, paso-3).
 * Solo uno se ve a la vez; los demás tienen la clase "oculto".
 * Antes de avanzar, se valida el paso actual.
 */

// Aquí se guardan los datos que el usuario escribe en cada paso
const datosRegistro = {
  nombre: "",
  cedula: "",
  telefono: "",
  correo: "",
  contrasena: ""
};

const botonConfirmar = document.getElementById("botonConfirmar");

activarOjos();

/**
 * Muestra el bloque del paso indicado y actualiza la lista de la izquierda.
 * @param {number} numero - 1, 2 o 3. El número 4 muestra la pantalla "¡Cuenta creada!".
 */
function mostrarPaso(numero) {
  // Ocultamos todos los bloques y mostramos solo el del paso pedido
  document.querySelectorAll(".paso-form").forEach(function (bloque) {
    bloque.classList.add("oculto");
  });
  const idBloque = numero === 4 ? "exito" : "paso-" + numero;
  document.getElementById(idBloque).classList.remove("oculto");

  // Actualizamos la lista de pasos del panel izquierdo
  document.querySelectorAll("#listaPasos li").forEach(function (item) {
    const paso = Number(item.dataset.paso);
    item.classList.remove("activo", "completado");
    const circulo = item.querySelector(".numero");

    if (paso < numero) {
      item.classList.add("completado");
      circulo.innerHTML = icono("check");      // paso ya terminado: muestra ✓
    } else {
      circulo.textContent = paso;              // paso pendiente o actual: muestra su número
      if (paso === numero) item.classList.add("activo");
    }
  });
}

/* ---------------- PASO 1: datos personales ---------------- */
document.getElementById("paso-1").addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(this);

  const nombre = document.getElementById("nombre").value.trim();
  const cedula = document.getElementById("cedula").value.trim();
  // Quitamos espacios del teléfono para aceptar "310 000 0000"
  const telefono = document.getElementById("telefono").value.replace(/\s/g, "");

  let valido = true;

  if (nombre.length < 3) {
    marcarError("nombre", "Escribe tu nombre completo (mínimo 3 letras).");
    valido = false;
  }
  if (!esCedulaValida(cedula)) {
    marcarError("cedula", "La cédula o NIT debe tener entre 6 y 12 números.");
    valido = false;
  }
  if (!esTelefonoValido(telefono)) {
    marcarError("telefono", "El teléfono debe tener 10 números.");
    valido = false;
  }
  if (!valido) return;

  datosRegistro.nombre = nombre;
  datosRegistro.cedula = cedula;
  datosRegistro.telefono = telefono;
  mostrarPaso(2);
});

/* ---------------- PASO 2: credenciales ---------------- */
document.getElementById("paso-2").addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(this);

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const confirmar = document.getElementById("confirmar").value;

  let valido = true;

  if (!esCorreoValido(correo)) {
    marcarError("correo", "Escribe un correo electrónico válido.");
    valido = false;
  }
  if (contrasena.length < 6) {
    marcarError("contrasena", "La contraseña debe tener al menos 6 caracteres.");
    valido = false;
  }
  if (confirmar !== contrasena) {
    marcarError("confirmar", "Las contraseñas no coinciden.");
    valido = false;
  }
  if (!valido) return;

  datosRegistro.correo = correo;
  datosRegistro.contrasena = contrasena;

  // Llenamos el resumen del paso 3 (textContent evita insertar HTML peligroso)
  document.getElementById("resumenNombre").textContent = datosRegistro.nombre;
  document.getElementById("resumenCedula").textContent = datosRegistro.cedula;
  document.getElementById("resumenTelefono").textContent = datosRegistro.telefono;
  document.getElementById("resumenCorreo").textContent = datosRegistro.correo;

  mostrarPaso(3);
});

/* ---------------- Botones "Atrás" ---------------- */
// Hay uno en el paso 2 y otro en el paso 3. Cada uno vuelve al paso anterior.
document.querySelectorAll('[data-accion="atras"]').forEach(function (boton) {
  boton.addEventListener("click", function () {
    const bloque = boton.closest(".paso-form");
    const pasoActual = Number(bloque.id.replace("paso-", ""));
    document.getElementById("mensaje").className = "mensaje"; // limpia el mensaje de la API
    mostrarPaso(pasoActual - 1);
  });
});

/* ---------------- PASO 3: confirmar y crear la cuenta ---------------- */
botonConfirmar.addEventListener("click", async function () {
  botonConfirmar.disabled = true;
  botonConfirmar.textContent = "Creando cuenta...";

  // Datos adicionales que el diseño pide además del correo y la contraseña
  const extras = {
    nombre: datosRegistro.nombre,
    cedula: datosRegistro.cedula,
    telefono: datosRegistro.telefono
  };

  const resultado = await enviarCredenciales(
    CONFIG.RUTA_REGISTRO,
    datosRegistro.correo,
    datosRegistro.contrasena,
    extras
  );

  if (resultado.ok) {
    // Cuenta creada: mostramos la pantalla de éxito (paso "4") y
    // los 3 pasos quedan marcados como completados a la izquierda
    document.getElementById("nombreExito").textContent = datosRegistro.nombre;
    mostrarPaso(4);
  } else {
    // Algo salió mal (por ejemplo, el correo ya existe): mostramos el motivo
    mostrarMensaje("mensaje", false, resultado.mensaje);
    botonConfirmar.disabled = false;
    botonConfirmar.textContent = "Confirmar y crear cuenta";
  }
});
